import { TextControl, Spinner } from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default class ApiKeyField extends Component {
	render() {
		const { apiKey, isApiKeySaved, isLoading, onApiKeyChange } = this.props;

		return (
			<Fragment>
				{ isLoading ? (
					<Spinner />
				) : (
					<TextControl
						label={ __( 'Enter Giphy API Key', 'giphy-block' ) }
						onChange={ onApiKeyChange }
						value={ apiKey }
					/>
				) }
				{ isApiKeySaved && (
					<div className="giphy-block-api-saved">
						{ __( 'Saved', 'giphy-block' ) }
					</div>
				) }
			</Fragment>
		);
	}
}
