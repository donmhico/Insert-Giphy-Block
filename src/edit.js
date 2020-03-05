import { Component } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, BlockAlignmentToolbar } from '@wordpress/editor';
import { addQueryArgs } from '@wordpress/url';
import { debounce } from 'lodash';

import SearchGiphy from "./components/SearchGiphy";
import Gif from "./components/Gif";

export default class Edit extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: false, // If currently fetching from Giphy.
			isSearching: !props.attributes.gif, // If we need to show the search field.
			gifs: [], // Cache results from Giphy.
			pagination: 0, // Current pagination.
		};

		// Get the API Key from https://developers.giphy.com/.
		this.API_KEY = '[INSERT API KEY HERE]';
		this.GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
		this.GIPHY_RESULTS_LIMIT = 5;

		this.onSearchChangeHandler = this.onSearchChangeHandler.bind( this );
		this.fetchGiphy = this.fetchGiphy.bind( this );
		// Use debounce to prevent multiple concurrent request to Giphy.
		this.onSearchChange = debounce( this.onSearchChange.bind( this ), 500 );
		this.onGiphyClick = this.onGiphyClick.bind( this );

		this.onRemoveClickHandler = this.onRemoveClickHandler.bind( this );
	}

	componentWillUnmount() {
		this.onSearchChange.cancel();
	}

	/**
	 * Debounced function
	 *
	 * @returns {Promise<void>}
	 */
	async onSearchChange() {
		const {
			attributes: { search }
		} = this.props;

		const pagination = this.state.pagination / this.GIPHY_RESULTS_LIMIT;

		const results = await this.fetchGiphy( search, pagination );

		if ( 200 !== results.meta.status ) {
			// TODO handle error.
			return;
		}

		// The idea is to 'cache' the past results in the state.
		// Something like
		// gifs[0] => Will contain results of pagination 0.
		// gifs[1] => Results of pagination 1.
		// and so on..
		let gifs = this.state.gifs;
		gifs[ pagination ] = results.data;

		this.setState( {
			isLoading: false,
			pagination: pagination,
			gifs: gifs
		} );
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
			api_key: this.API_KEY,
			offset: pagination,
		} );

		return fetch( requestUrl )
			.then( data => data.json() )
			.catch( error => error );
	};

	onGiphyClick( event, { photo } ) {
		// Save the selected photo data as `gif` in the DB.
		this.props.setAttributes( { gif: photo } );
		this.setState( { isSearching: false } );
	}

	onSearchChangeHandler( search ) {
		this.setState( { isLoading: true } );
		// Save the search keyword as `search` in the DB.
		this.props.setAttributes( { search } );
		this.onSearchChange();
	}

	onRemoveClickHandler() {
		this.setState( {
			isSearching: true,
			isLoading: true,
		} );

		this.onSearchChange();
	}

	render() {
		const {
			attributes: {
				search,
				gif,
				blockAlignment,
				textAlignment
			},
			className,
			setAttributes
		} = this.props;

		const { isLoading, isSearching, gifs, pagination } = this.state;

		return (
			<div className={ className }>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						onChange={ blockAlignment => setAttributes( { blockAlignment } ) }
					/>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ textAlignment => setAttributes( { textAlignment } ) }
					/>
				</BlockControls>

				{ isSearching ? (
					<SearchGiphy
						search={ search }
						onSearchChangeHandler={ this.onSearchChangeHandler }
						isLoading={ isLoading }
						gifs={ gifs }
						onGiphyClick={ this.onGiphyClick }
						pagination={ pagination }
					/>
				) : (
					<Gif onRemoveClickHandler={ this.onRemoveClickHandler } gif={ gif.src } />
				) }
			</div>
		);
	}
}
