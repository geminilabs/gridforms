;(function() {
	"use strict";

	var GridForms = function( options ) {
		var self = this;
		for( var key in options || {} ) {
			this.config_[key] = options[key];
		}
		self.timer = null;
		self.fields = self.querySelectorAll_( self.config_.field );
		self.rows = self.querySelectorAll_( self.config_.row );
		if( self.fields.length === 0 || self.rows === 0 )return;
		self.init_();
	};

	GridForms.prototype = {
		config_: {
			field: '[data-field-span]',
			min_width: 700,
			row: '[data-row-span]',
			tags: 'input, select, textarea',
			types: ['date', 'email', 'number', 'select', 'tel', 'text', 'textarea', 'url'],
		},
		/** @return void */
		equalizeFieldHeights_: function() {
			var self = this;
			self.fields.forEach( function( field ) {
				field.style.height = 'auto';
			});
			if( self.isStacked_() || window.innerWidth <= self.config_.min_width )return;
			self.rows.forEach( function( row ) {
				if( !self.isVisible_( row ) || ( row.children.length === 1 && self.querySelectorAll_( 'textarea', row ).length === 1 ))return;
				var rowHeight = row.offsetHeight + 'px';
				self.querySelectorAll_( self.config_.field, row ).forEach( function( field ) {
					field.style.height = rowHeight;
				});
			});
		},
		/** @return void */
		focusField_: function( el ) {
			var field = el.closest( this.config_.field );
			if( field ) {
				field.classList.add( 'focus' );
			}
		},
		/** @return void */
		init_: function() {
			var self = this;
			self.focusField_( document.activeElement );
			self.equalizeFieldHeights_();
			self.initEvents_();
		},
		/** @return void */
		initEvents_: function() {
			var self = this;
			self.fields.forEach( function( el ) {
				el.addEventListener( 'click', self.onClick_.bind( self ));
				var controls = self.querySelectorAll_( self.config_.tags, el );
				controls.forEach( function( el ) {
					if( !~self.config_.types.indexOf( el.type ))return;
					el.addEventListener( 'blur', self.removeFieldFocus_.bind( self ));
					el.addEventListener( 'focus', self.onFocus_.bind( self ));
				});
			});
			window.addEventListener( 'resize', self.onResize_.bind( self ));
		},
		/** @return bool */
		isStacked_: function() {
			var firstRow;
			var i;
			var self = this;
			var totalWidth = 0;
			for( i = 0; i < self.rows.length; i++ ) {
				if( self.rows[i].dataset['row-span'] !== '1' ) {
					firstRow = self.rows[i];
					break;
				}
			}
			if( !firstRow ) {
				return true;
			}
			for( i = 0; i < firstRow.children.length; i++ ) {
				totalWidth += firstRow.children[i].offsetWidth;
			}
			return totalWidth > firstRow.offsetWidth;
		},
		/** @return bool */
		isVisible_: function( el ) {
			return el.offsetWidth > 0 && el.offsetHeight > 0;
		},
		/** @return void */
		onClick_: function( ev ) {
			var self = this;
			var controls = self.querySelectorAll_( self.config_.tags, ev.currentTarget );
			for( var i = 0; i < controls.length; i++ ) {
				if( ~self.config_.types.indexOf( controls[i].type )) {
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
			var self = this;
			if( self.timeout ) {
				window.cancelAnimationFrame( self.timeout );
			}
			self.timeout = window.requestAnimationFrame( self.equalizeFieldHeights_.bind( self ));
		},
		/** @return NodeList */
		querySelectorAll_: function( selector, context ) {
			return ( context || document ).querySelectorAll( selector );
		},
		/** @return void */
		removeFieldFocus_: function() {
			this.fields.forEach( function( el ) {
				el.classList.remove( 'focus' );
			});
		},
	};
	window.GridForms = GridForms;
})();
