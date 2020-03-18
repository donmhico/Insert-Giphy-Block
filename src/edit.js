import apiFetch from '@wordpress/api-fetch';
import {
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
} from '@wordpress/editor';
import { Component, Fragment } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { debounce, delay } from 'lodash';

import ApiKeyField from './components/ApiKeyField';
import Gif from './components/Gif';
import GiphyInspectorControl from './components/GiphyInspectorControl';
import SearchGiphy from './components/SearchGiphy';

export default class Edit extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			apiKey: '', // Giphy API Key. Set in the InspectorControls and globally as a DB option.
			error: false, // Error on fetching Giphy request.
			gifs: [], // Cache results from Giphy.
			isApiKeySaved: false, // If API Key was saved.
			isLoading: false, // If currently fetching from Giphy.
			isProcessingApiKey: true, // If currently fetching or saving the API Key.
			isSearching: ! props.attributes.gif, // If we need to show the search field.
			isTypingApiKey: false, // If API key currently being typed.
			maxPage: 0, // Max results page.
			pagination: 1, // Current pagination.
		};

		this.GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
		this.GIPHY_RESULTS_LIMIT = 10;

		this.fetchGiphy = this.fetchGiphy.bind( this );

		this.onApiKeyChange = this.onApiKeyChange.bind( this );
		this.onApiKeyChangeHandler = debounce(
			this.onApiKeyChangeHandler.bind( this ),
			500
		);

		this.onSearchChangeHandler = this.onSearchChangeHandler.bind( this );
		// Use debounce to prevent multiple concurrent request to Giphy.
		this.onSearchChange = debounce( this.onSearchChange.bind( this ), 500 );

		this.onGiphyClick = this.onGiphyClick.bind( this );

		this.onRemoveClickHandler = this.onRemoveClickHandler.bind( this );

		this.updateIsApiKeySavedToFalse = this.updateIsApiKeySavedToFalse.bind(
			this
		);

		this.onPaginationChangeHandler = this.onPaginationChangeHandler.bind(
			this
		);

		this.onAltChangeHandler = this.onAltChangeHandler.bind( this );
	}

	/**
	 * Fetch the API key on component mount.
	 *
	 * @since 1.0.0
	 *
	 * @returns {Promise<void>}
	 */
	async componentDidMount() {
		const apiKey = await this.fetchApiKey();

		this.setState( {
			apiKey,
			isProcessingApiKey: false,
		} );
	}

	/**
	 * Cancel debounce invocation.
	 *
	 * @since 1.0.0
	 */
	componentWillUnmount() {
		this.onSearchChange.cancel();
		this.onApiKeyChangeHandler.cancel();
	}

	fetchApiKey() {
		return apiFetch( {
			path: '/dminsertgiphyblock/v1/api-key',
		} )
			.then( ( apiKey ) => apiKey )
			.catch( ( error ) => error );
	}

	saveApiKey( apiKey ) {
		return apiFetch( {
			path: '/dminsertgiphyblock/v1/api-key',
			method: 'POST',
			body: apiKey,
		} ).catch( ( error ) => error );
	}

	/**
	 * Debounced function
	 *
	 * @returns {Promise<void>}
	 */
	async onSearchChange() {
		const {
			attributes: { search },
		} = this.props;

		if ( this.state.gifs[ this.state.pagination ] ) {
			this.setState( {
				isLoading: false,
			} );
			return;
		}

		// Minus 1 is needed as offset starts with 0.
		const offset = ( this.state.pagination - 1 ) * this.GIPHY_RESULTS_LIMIT;

		const results = await this.fetchGiphy( search, offset );

		if ( ! results.meta || 200 !== results.meta.status ) {
			this.setState( {
				error: results,
				isLoading: false,
			} );
			return;
		}

		// The idea is to 'cache' the past results in the state.
		// Something like
		// gifs[0] => Will contain results of pagination 0.
		// gifs[1] => Results of pagination 1.
		// and so on..
		const gifs = this.state.gifs;
		gifs[ this.state.pagination ] = results.data;

		const newState = {
			error: false,
			isLoading: false,
			gifs,
		};

		if ( this.state.maxPage === 0 ) {
			newState.maxPage = Math.ceil(
				results.pagination.total_count / this.GIPHY_RESULTS_LIMIT
			);
		}

		this.setState( newState );
	}

	/**
	 * Fetch data from Giphy.
	 *
	 * @param search string
	 * @param pagination int
	 *
	 * @returns {Promise<any>}
	 */
	fetchGiphy( search, pagination ) {
		// Build the request url.
		const requestUrl = addQueryArgs( this.GIPHY_ENDPOINT, {
			q: search,
			limit: this.GIPHY_RESULTS_LIMIT,
			api_key: this.state.apiKey,
			offset: pagination,
		} );

		return fetch( requestUrl )
			.then( ( data ) => data.json() )
			.catch( ( error ) => error );
	}

	/**
	 * Invoked when a GIF was selected.
	 *
	 * This will set the selected `photo` sa `gif` attribute
	 * and set the state `isSearching` to false to render the selected GIF
	 * instead of the "search gif" field.
	 *
	 * @param event
	 * @param photo
	 */
	onGiphyClick( event, { photo } ) {
		// Save the selected photo data as `gif` in the DB.
		this.props.setAttributes( { gif: photo } );
		this.setState( { isSearching: false } );
	}

	/**
	 * Invoked immediately whenever the user enter a new value in the search
	 * gif field.
	 *
	 * 1. This will reset the `state` to remove previous search results.
	 * 2. Set the passed `search` which is the value of the search field as `search` attribute.
	 * 3. Call this.onSearchChange().
	 *
	 * @param search
	 */
	onSearchChangeHandler( search ) {
		// Reset the state empty previous search results..
		this.setState( {
			error: false,
			gifs: [],
			isLoading: true,
			maxPage: 0,
			pagination: 1,
		} );

		// Save the search keyword as `search` in the DB.
		this.props.setAttributes( { search } );
		this.onSearchChange();
	}

	/**
	 * Invoked when the pagination was changed, either by changing the page in the
	 * pagination field or clicking the nav buttons.
	 *
	 * @param pagination
	 */
	onPaginationChangeHandler( pagination ) {
		this.setState( {
			isLoading: true,
			pagination: Number( pagination ),
		} );

		this.onSearchChange();
	}

	/**
	 * Invoked when the "Trash" button is clicked.
	 * This will remove the current selected GIF and will allow the user to search again.
	 */
	onRemoveClickHandler() {
		this.setState( {
			isLoading: true,
			isSearching: true,
		} );

		this.onSearchChange();
	}

	/**
	 * Invoked when the API Key field was changed.
	 *
	 * @param apiKey string
	 */
	onApiKeyChange( apiKey ) {
		this.setState( {
			apiKey,
			isTypingApiKey: true,
		} );

		this.onApiKeyChangeHandler();
	}

	/**
	 * Save the current apiKey in state in the DB as the API Key.
	 *
	 * @returns {Promise<void>}
	 */
	async onApiKeyChangeHandler() {
		this.setState( {
			isProcessingApiKey: true,
		} );

		await this.saveApiKey( this.state.apiKey );
		this.setState( {
			isApiKeySaved: true,
			isProcessingApiKey: false,
			isTypingApiKey: false,
		} );

		// The invocation of this.updateIsApiKeySavedToFalse is delayed for 3 seconds to give time
		// for the user to see the "Saved" UI before it disappears.
		delay( this.updateIsApiKeySavedToFalse, 3000 );
	}

	onAltChangeHandler( alt ) {
		this.props.setAttributes( { alt } );
	}

	/**
	 * Setting the state `isApiKeySaved` to false will hide the 'Saved' message.
	 */
	updateIsApiKeySavedToFalse() {
		this.setState( { isApiKeySaved: false } );
	}

	render() {
		const {
			attributes: { alt, blockAlignment, gif, search, textAlignment },
			className,
			setAttributes,
		} = this.props;

		const {
			apiKey,
			error,
			gifs,
			isApiKeySaved,
			isLoading,
			isProcessingApiKey,
			isSearching,
			isTypingApiKey,
			maxPage,
			pagination,
		} = this.state;

		let showApiKeyField = false;
		if ( apiKey.length === 0 || isTypingApiKey ) {
			showApiKeyField = true;
		}

		let showGif = false;
		if ( gif && gif.src && ! isSearching ) {
			showGif = true;
		}

		return (
			<div className={ className }>
				<GiphyInspectorControl
					alt={ alt }
					apiKey={ apiKey }
					isApiKeySaved={ isApiKeySaved }
					isLoading={ isProcessingApiKey }
					onAltChangeHandler={ this.onAltChangeHandler }
					onApiKeyChange={ this.onApiKeyChange }
				/>

				{ showApiKeyField ? (
					<ApiKeyField
						apiKey={ apiKey }
						isApiKeySaved={ isApiKeySaved }
						isLoading={ isProcessingApiKey }
						onApiKeyChange={ this.onApiKeyChange }
					/>
				) : showGif ? (
					<Fragment>
						<BlockControls>
							<BlockAlignmentToolbar
								onChange={ ( blockAlignment ) =>
									setAttributes( { blockAlignment } )
								}
								value={ blockAlignment }
							/>
							<AlignmentToolbar
								onChange={ ( textAlignment ) =>
									setAttributes( { textAlignment } )
								}
								value={ textAlignment }
							/>
						</BlockControls>

						<Gif
							gif={ gif.src }
							onRemoveClickHandler={ this.onRemoveClickHandler }
							style={ { textAlign: textAlignment } }
						/>
					</Fragment>
				) : (
					<SearchGiphy
						error={ error }
						gifs={ gifs }
						isLoading={ isLoading }
						onGiphyClick={ this.onGiphyClick }
						onPaginationChangeHandler={
							this.onPaginationChangeHandler
						}
						onSearchChangeHandler={ this.onSearchChangeHandler }
						maxPage={ maxPage }
						pagination={ pagination }
						search={ search }
					/>
				) }
			</div>
		);
	}
}
