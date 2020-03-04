import { Component } from '@wordpress/element';
import { TextControl } from '@wordpress/components';

export default class Edit extends Component {
	render() {
		const {
			attributes: {
				search
			},
			setAttributes,
		} = this.props;

		return (
			<TextControl
				label="Search GIF"
				value={ search }
				onChange={ search => setAttributes( { search } )}
			/>
		);
	}
}
