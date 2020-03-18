import { Button, Icon } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default class Gif extends Component {
	render() {
		const { gif, onRemoveClickHandler, style } = this.props;

		return (
			<div style={ style }>
				<img alt={ __( 'Selected GIF', 'insert-giphy-block' ) } src={ gif } />
				<div>
					<Button isDefault onClick={ onRemoveClickHandler }>
						<Icon icon="trash" />
					</Button>
				</div>
			</div>
		);
	}
}
