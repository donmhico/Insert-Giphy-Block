import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import ApiKeyField from './ApiKeyField';

export default class GiphyInspectorControl extends Component {
	render() {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						initialOpen
						title={ __( 'Insert Giphy Block Settings', 'insert-giphy-block' ) }
					>
						<ApiKeyField { ...this.props } />
						<PanelRow>
							<TextControl
								label={ __( 'GIF Alt', 'insert-giphy-block' ) }
								placeholder={ __( 'Alt', 'insert-giphy-block' ) }
								onChange={ this.props.onAltChangeHandler }
								value={ this.props.alt }
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}
