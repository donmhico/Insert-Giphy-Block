import { Button, Icon, Spinner, TextControl } from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import Gallery from 'react-photo-gallery';

export default class SearchGiphy extends Component {
	render() {
		const {
			error,
			gifs,
			isLoading,
			maxPage,
			onGiphyClick,
			onPaginationChangeHandler,
			onSearchChangeHandler,
			pagination,
			search,
		} = this.props;

		let resultGifs;
		if ( gifs[ pagination ] ) {
			resultGifs = [];
			resultGifs = gifs[ pagination ].map( ( gifData ) => {
				return {
					height: gifData.images.original.height,
					src: gifData.images.original.url,
					width: gifData.images.original.width,
				};
			} );
		}

		return (
			<Fragment>
				<TextControl
					label={ __( 'Search GIF', 'insert-giphy-block' ) }
					onChange={ onSearchChangeHandler }
					placeholder={ __( 'Search GIF', 'insert-giphy-block' ) }
					value={ search }
				/>

				{ isLoading && (
					<div className="giphy_spinner_container">
						<Spinner />
					</div>
				) }

				{ error && (
					<div className="components-notice is-error">
						<div className="components-notice__content">
							{ error.message }
						</div>
					</div>
				) }

				{ resultGifs && resultGifs.length > 0 && (
					<Fragment>
						<Gallery
							onClick={ onGiphyClick }
							photos={ resultGifs }
						/>

						<div className="giphy_nav_controls">
							{ pagination > 1 && (
								<div className="giphy_nav_controls__control">
									<Button
										isLink
										onClick={ () =>
											onPaginationChangeHandler(
												pagination - 1
											)
										}
									>
										<Icon size="32" icon="controls-back" />
									</Button>
								</div>
							) }

							<div className="giphy_nav_controls__control">
								<TextControl
									className="giphy_nav_field"
									onChange={ ( input ) => {
										if ( isNaN( input ) || input <= 0 ) {
											return 1;
										}

										if ( input > maxPage ) {
											input = maxPage;
										}

										onPaginationChangeHandler( input );
									} }
									value={ pagination }
								/>
							</div>

							<div className="giphy_nav_controls__control">/</div>
							<div className="giphy_nav_controls__control">
								{ maxPage }
							</div>

							{ pagination < maxPage && (
								<div className="giphy_nav_controls__control">
									<Button
										isLink
										onClick={ () =>
											onPaginationChangeHandler(
												pagination + 1
											)
										}
									>
										<Icon
											size="32"
											icon="controls-forward"
										/>
									</Button>
								</div>
							) }
						</div>
					</Fragment>
				) }

				{ resultGifs && resultGifs.length === 0 && (
					<p>
						{ sprintf(
							__( 'Nothing found for "%s".', 'insert-giphy-block' ),
							search
						) }
					</p>
				) }
			</Fragment>
		);
	}
}
