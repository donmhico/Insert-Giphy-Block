import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/editor';
import { PanelBody, PanelRow, TextControl, Spinner } from '@wordpress/components';

export default class GiphyInspectorControl extends Component {
	render() {
		const {
			isLoading,
			apiKey,
			onApiKeyChange,
		} = this.props;
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Giphy Block Settings', 'giphy-block' ) }
						initialOpen>
						<PanelRow>
							{ isLoading ? (
								<Spinner />
							) : (
								<TextControl
									label={ __( 'Enter Giphy API Key' ) }
									value={ apiKey }
									onChange={ apiKey => onApiKeyChange( apiKey ) }
								/>
							) }
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}
