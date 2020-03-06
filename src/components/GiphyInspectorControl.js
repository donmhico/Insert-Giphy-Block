import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/editor';
import { PanelBody } from '@wordpress/components';
import ApiKeyField from "./ApiKeyField";

export default class GiphyInspectorControl extends Component {
	render() {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Giphy Block Settings', 'giphy-block' ) }
						initialOpen>
						<ApiKeyField { ...this.props } />
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}
