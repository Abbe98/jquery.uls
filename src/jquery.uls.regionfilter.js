/**
 * jQuery region filter plugin.
 *
 * Copyright (C) 2012 Alolita Sharma, Amir Aharoni, Arun Ganesh, Brandon Harris,
 * Niklas Laxström, Pau Giner, Santhosh Thottingal, Siebrand Mazeland and other
 * contributors. See CREDITS for a list.
 *
 * UniversalLanguageSelector is dual licensed GPLv2 or later and MIT. You don't
 * have to do anything special to choose one license or the other and you don't
 * have to notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @file
 * @ingroup Extensions
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

(function ( $ ) {
	"use strict";

	/* RegionSelector plugin definition */

	/**
	 * Region selector is a language selector based on regions.
	 * Usage: $( 'jqueryselector' ).regionselector( options );
	 * The attached element should have data-regiongroup attribute
	 * that defines the regiongroup for the selector.
	 */
	var RegionSelector = function( element, options ) {
		this.$element = $( element );
		this.options = $.extend( {}, $.fn.regionselector.defaults, options );
		this.$element.addClass( 'regionselector' );
		this.regions = [];
		this.regionGroup = this.$element.data( 'regiongroup' );
		this.init();
		this.listen();
	};

	RegionSelector.prototype = {
		constructor: RegionSelector,

		init: function() {
			var region = this.$element.data( 'region' );
			this.regions = $.uls.data.regionsInGroup( this.regionGroup );
			if ( region ) {
				this.regions.push( region );
			}
		},

		test: function( langCode ) {
			var langRegions = $.uls.data.regions( langCode ),
				region;

			for ( var i = 0; i < this.regions.length; i++ ) {
				region = this.regions[i];
				if ( $.inArray( region, langRegions ) >= 0 ) {
					this.render( langCode, region );
					return;
				}
			}
		},

		show: function() {
			// Make the selected region (and it only) active
			$( '.regionselector' ).removeClass( 'active' );
			if ( this.regionGroup ) {
				// if there is a region group, make it active.
				this.$element.addClass( 'active' );
			}

			// Re-populate the list of languages
			this.options.$target.empty();
			var languagesByScriptGroup = $.uls.data.languagesByScriptGroup( this.options.languages );
			for ( var scriptGroup in languagesByScriptGroup ) {
				var languages = languagesByScriptGroup[scriptGroup];
				languages.sort( $.uls.data.sortByAutonym );
				for ( var i = 0; i < languages.length; i++ ) {
					this.test( languages[i] );
				}
			}

			if ( this.options.success ) {
				this.options.success.call();
			}
		},

		render: function( langCode, region ) {
			var $target = this.options.$target;
			if ( !$target ) {
				return;
			}
			$target.append( langCode, region );
		},

		listen: function() {
			this.$element.on( 'click', $.proxy( this.click, this ) );
		},

		click: function( e ) {
			if( this.$element.hasClass( 'active' ) ) {
				this.$element.removeClass( 'active' );
				if ( this.options.noresults ) {
					this.options.noresults.call();
				}
			} else {
				this.show();
			}
		}
	};

	/* RegionSelector plugin definition */

	$.fn.regionselector = function( option ) {
		return this.each( function() {
			var $this = $( this ),
				data = $this.data( 'regionselector' ),
				options = typeof option === 'object' && option;

			if ( !data ) {
				$this.data( 'regionselector', ( data = new RegionSelector( this, options ) ) );
			}
			if ( typeof option === 'string' ) {
				data[option]();
			}
		} );
	};

	$.fn.regionselector.defaults = {
		$target: null, // Where to render the results
		success: null, // callback if any results found.
		noresults: null, // callback when no results to show
		languages: null
	};

	$.fn.regionselector.Constructor = RegionSelector;
} )( jQuery );
