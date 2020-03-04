import { Component, Fragment } from '@wordpress/element';
import { TextControl, Spinner } from '@wordpress/components';
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
			pagination
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

			</Fragment>
		);
	}
}
