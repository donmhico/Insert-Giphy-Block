import { Component, Fragment } from '@wordpress/element';
import { TextControl, Spinner, Button, Dashicon } from '@wordpress/components';
import Gallery from "react-photo-gallery";

export default class SearchGiphy extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			search,
			onSearchChangeHandler,
			isLoading,
			gifs,
			onGiphyClick,
			pagination,
			onPaginationChangeHandler,
			maxPage,
		} = this.props;

		let result_gifs;
		if ( gifs[ pagination ] ) {
			result_gifs = [];
			result_gifs = gifs[ pagination ].map( ( gif_data ) => {
				return {
					src: gif_data.images.downsized_medium.url,
					width: gif_data.images.downsized_medium.width,
					height: gif_data.images.downsized_medium.height,
				};
			} )
		}

		return (
			<Fragment>
				<TextControl
					label="Search GIF"
					value={ search }
					onChange={ ( search ) => {
						onSearchChangeHandler( search );
					} }
				/>

				{ isLoading && (
					<Spinner />
				) }

				{ result_gifs && result_gifs.length && (
					<Fragment>
						<Gallery photos={ result_gifs } onClick={ onGiphyClick } />
					</Fragment>
				) }

				{ result_gifs && result_gifs.length === 0 && (
					<p>{ `Nothing found for '${search}'.` }</p>
				) }

				{ gifs.length > 0 && (
					<div className="giphy_nav_controls">
						{ pagination > 1 && (
							<div>
								<Button onClick={ () => onPaginationChangeHandler( pagination - 1 ) } >
									<Dashicon icon="controls-back"/>
								</Button>
							</div>
						) }

						<div>
							<TextControl
								onChange={ ( input ) => {
									if ( isNaN( input ) || input <= 0 ) {
										return;
									}

									if ( input > maxPage ) {
										input = maxPage;
									}

									onPaginationChangeHandler( input );
								} }
								value={ pagination }/>
						</div>
						<div>/</div>
						<div>{ maxPage }</div>

						{ pagination < maxPage && (
							<div>
								<Button onClick={ () => onPaginationChangeHandler( pagination + 1 ) } >
									<Dashicon icon="controls-forward"/>
								</Button>
							</div>
						) }

					</div>
				) }

			</Fragment>
		);
	}
}
