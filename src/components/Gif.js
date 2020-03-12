import { Component } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';

export default class Gif extends Component {
	render() {
		return (
			<div style={ this.props.style }>
				<img src={ this.props.gif } />
				<div>
					<Button isDefault onClick={ this.props.onRemoveClickHandler }><Icon icon="trash"/></Button>
				</div>
			</div>
		)
	}
}
