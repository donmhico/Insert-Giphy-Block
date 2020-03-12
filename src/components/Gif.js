import { Button, Icon } from '@wordpress/components';
import { Component } from '@wordpress/element';

export default class Gif extends Component {
	render() {
		const {
			gif,
			onRemoveClickHandler,
			style,
		} = this.props;

		return (
			<div style={ style }>
				<img src={ gif } />
				<div>
					<Button
						isDefault
						onClick={ onRemoveClickHandler }
					>
						<Icon icon="trash"/>
					</Button>
				</div>
			</div>
		)
	}
}
