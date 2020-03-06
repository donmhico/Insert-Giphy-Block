import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { TextControl, Spinner } from '@wordpress/components';

export default class ApiKeyField extends Component {
	render() {
		const {
			isLoading,
			apiKey,
			onApiKeyChange,
			isApiKeySaved,
		} = this.props;

		return (
			<Fragment>
				{ isLoading ? (
					<Spinner />
				) : (
					<TextControl
						label={ __( 'Enter Giphy API Key', 'giphy-block' ) }
						value={ apiKey }
						onChange={ apiKey => onApiKeyChange( apiKey ) }
					/>
				) }
				{ isApiKeySaved && (
					<div>{ __( 'Saved', 'giphy-block' ) }</div>
				) }
			</Fragment>
		);
	}
}
