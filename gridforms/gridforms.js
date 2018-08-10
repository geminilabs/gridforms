;(function() {
	"use strict";

	var GridForms = function() {
		this.fields = this.querySelectorAll_( this.config_.field );
		this.rows = this.querySelectorAll_( this.config_.row );
		if( this.fields.length === 0 || this.rows === 0 )return;
		this.init_();
	};

	GridForms.prototype = {
		config_: {
			field: '[data-field-span]',
			focusable: 'input, select, textarea',
			row: '[data-row-span]',
			types: ['date', 'email', 'number', 'select', 'tel', 'text', 'textarea', 'url'],
			min_width: 700,
		},
		/** @return void */
		focusField_: function( el ) {
			var field = el.closest( this.config_.field );
			if( field ) {
				field.classList.add( 'focus' );
			}
		},
		/** @return bool */
		areFieldsStacked_: function() {
			var firstRow;
			var totalWidth = 0;
			var i;
			for( i = 0; i < this.rows.length; i++ ) {
				if( this.rows[i].dataset['row-span'] !== '1' ) {
					firstRow = this.rows[i];
					break;
				}
			}
			if( !firstRow ) {
				firstRow = this.rows[0];
			}
			for( i = 0; i < firstRow.children.length; i++ ) {
				totalWidth += firstRow.children[i].offsetWidth;
			}
			return firstRow.offsetWidth <= totalWidth;
		},
		/** @return void */
		equalizeFieldHeights_: function() {
		},
		/** @return void */
		init_: function() {
			this.focusField_( document.activeElement );
			this.onResize_();
			this.initEvents_();
		},
		/** @return void */
		initEvents_: function() {
			this.fields.forEach( function( el ) {
				el.addEventListener( 'click', this.onClick_.bind( this ));
				var controls = this.querySelectorAll_( this.config_.focusable, el );
				controls.forEach( function( el ) {
					if( !~this.config_.types.indexOf( el.type ))return;
					el.addEventListener( 'blur', this.removeFieldFocus_.bind( this ));
					el.addEventListener( 'focus', this.onFocus_.bind( this ));
				}.bind( this ));
			}.bind( this ));
			window.addEventListener( 'resize', this.onResize_.bind( this ));
		},
		/** @return bool */
		isVisible_: function( el ) {
			return el.offsetWidth > 0 && el.offsetHeight > 0;
		},
		/** @return void */
		onClick_: function( ev ) {
			var controls = this.querySelectorAll_( this.config_.focusable, ev.currentTarget );
			for( var i = 0; i < controls.length; i++ ) {
				if( ~this.config_.types.indexOf( controls[i].type )) {
					controls[i].focus();
					return;
				}
			}
		},
		/** @return void */
		onFocus_: function( ev ) {
			this.focusField_( ev.currentTarget );
		},
		/** @return void */
		onResize_: function() {
			this.fields.forEach( function( el ) {
				el.style.height = 'auto';
			});
			if( window.innerWidth <= this.config_.min_width )return;
			this.rows.forEach( function( el ) {
				if( !this.isVisible_( el ))return;
				if( el.children.length === 1 && this.querySelectorAll_( 'textarea', el ).length === 1 )return;
				var rowHeight = el.offsetHeight + 'px';
				this.querySelectorAll_( this.config_.field, el ).forEach( function( field ) {
					field.style.height = rowHeight;
				});
			}.bind( this ));
		},
		/** @return NodeList */
		querySelectorAll_: function( selector, context ) {
			return ( context || document ).querySelectorAll( selector );
		},
		/** @return void */
		removeFieldFocus_: function() {
			this.fields.forEach( function( el ) {
				el.classList.remove( 'focus' );
			}.bind( this ));
		},
	};
	window.GridForms = GridForms;
})();
