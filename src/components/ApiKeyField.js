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
						label={ __( 'Enter Giphy API Key', 'insert-giphy-block' ) }
						onChange={ onApiKeyChange }
						value={ apiKey }
					/>
				) }
				{ isApiKeySaved && (
					<div className="insert-giphy-block-api-saved">
						{ __( 'Saved', 'insert-giphy-block' ) }
					</div>
				) }
			</Fragment>
		);
	}
}
