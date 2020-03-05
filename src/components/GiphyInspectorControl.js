import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/editor';
import { PanelBody, PanelRow, TextControl, Button, Spinner } from '@wordpress/components';

export default class GiphyInspectorControl extends Component {
	render() {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Giphy Block Settings', 'giphy-block' ) }
						initialOpen>
						<TextControl
							label={ __( 'Enter Giphy API Key' ) }
							value={ this.props.apiKey }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}
