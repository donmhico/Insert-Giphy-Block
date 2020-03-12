import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import ApiKeyField from "./ApiKeyField";

export default class GiphyInspectorControl extends Component {
	render() {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						initialOpen
						title={ __( 'Giphy Block Settings', 'giphy-block' ) }
					>
						<ApiKeyField { ...this.props } />
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}
