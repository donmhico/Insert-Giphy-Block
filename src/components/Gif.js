import { Component } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';

export default class Gif extends Component {
	render() {
		return (
			<div>
				<Button isDefault onClick={ this.props.onRemoveClickHandler }><Icon icon="trash"/></Button>
				<img src={ this.props.gif } />
			</div>
		)
	}
}
