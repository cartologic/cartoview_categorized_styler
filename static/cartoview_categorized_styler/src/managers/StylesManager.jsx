import {
    DEFAULT_NUM_OF_CLASSES,
    MAX_SIZE,
    SOLID,
    UNIQUE_VALUES
} from '../constants/constants.jsx'

import CartoColor from 'cartocolor'
// import {getUrlWithQS} from './utils.jsx'
import WMSClient from "../gs-client/WMSClient.jsx"
import WPSClient from "../gs-client/WPSClient.jsx"
import {getCRSFToken} from '../helpers/helpers'

class StylesManager {
    url = URLS.geoserverRestProxy
    _styles = {}
    _newStyleNames = {};
    format = new OpenLayers.Format.SLD( { multipleSymbolizers: true } )
    getStyle( layerName, styleName, title ) {
        if ( styleName == "new" ) {
            return this._getNewStyle( layerName, title ).then( styleName =>
                this._styles[ styleName ] );
        }
        if ( this._styles[ styleName ] ) {
            return new Promise( ( resolve, reject ) => {
                resolve( this._styles[ styleName ] );
            } )
        }
        const url = this.url + "/styles/" + styleName + ".sld";
        return fetch( url, {
            credentials: 'include',
        } ).then( res => res.text() ).then( ( res ) => {
            const sld = res.trim();
            return this._parseStyle( layerName, styleName, sld );
        } );
    }
    updateStyleConfig( styleObj, newConfig ) {
        if ( newConfig.method == UNIQUE_VALUES ) {
            delete styleObj.config.numOfClasses;
        } else if ( newConfig.method && !styleObj.config.numOfClasses ) {
            newConfig.numOfClasses = DEFAULT_NUM_OF_CLASSES;
        }
        Object.assign( styleObj.config, newConfig );
    }
    generateRules( styleObj ) {
        if ( styleObj.config.method == "UNIQUE_VALUES" ) {
            return this.createUniqueRules( styleObj )
        }
        return this.createGraduatedRules( styleObj );
    }
    createGraduatedRules( styleObj, config ) {
        const { layerName, method, numOfClasses, attribute } = config;
        return WPSClient.vecFeatureClassStats( layerName, {
            attribute,
            method,
            classes: numOfClasses
        } ).then( ( classes ) => {
            const rules = [];
            const size = classes.length;
            classes.forEach( ( c, index ) => {
                const rule = new OpenLayers.Rule( {
                    symbolizers: [ this._getSymbolizer(
                        config, index,
                        size, 7 ) ],
                    title: c.label,
                    filter: new OpenLayers.Filter.Logical( {
                        type: OpenLayers.Filter
                            .Logical.AND,
                        filters: [
              new OpenLayers.Filter.Comparison( {
                                type: OpenLayers
                                    .Filter
                                    .Comparison
                                    .GREATER_THAN_OR_EQUAL_TO,
                                property: attribute,
                                value: c
                                    .min
                            } ),
              new OpenLayers.Filter.Comparison( {
                                type: OpenLayers
                                    .Filter
                                    .Comparison
                                    .LESS_THAN,
                                property: attribute,
                                value: c
                                    .max
                            } )
            ]
                    } )
                } );
                rules.push( rule );
            } );
            styleObj.namedLayers[ styleObj.name ].userStyles[ 0 ].rules =
                rules;
            return styleObj;
        } );
    }
    createUniqueRules( styleObj, config ) {
        const { layerName, attribute, layerType } = config;
        return WPSClient.gsUnique( layerName, attribute ).then( ( res ) => {
            const rules = [];
            const size = res.features.length;
            res.features.slice( 0, MAX_SIZE ).forEach( ( f, index ) => {
                const { value } = f.properties;
                const rule = new OpenLayers.Rule( {
                    symbolizers: [ this._getSymbolizer(
                        config, index,
                        size, MAX_SIZE ) ],
                    title: value,
                    filter: new OpenLayers.Filter.Comparison( {
                        type: OpenLayers.Filter
                            .Comparison.EQUAL_TO,
                        property: attribute,
                        value
                    } )
                } );
                rules.push( rule );
            } );
            if ( size > MAX_SIZE ) {
                const rule = new OpenLayers.Rule( {
                    symbolizers: [ this._getSymbolizer(
                        config, MAX_SIZE, size,
                        MAX_SIZE ) ],
                    title: "Others"
                } );
                rules.unshift( rule );
            }
            styleObj.namedLayers[ styleObj.name ].userStyles[ 0 ].rules =
                rules;
            return styleObj;
        } );
    }
    _getColor( property, config, index, size, defaultSize ) {
        if ( config[ property ] == SOLID ) {
            return config[ property + "Color" ]
        }
        const paletteName = config[ property + "Color" ];
        const palette = CartoColor[ paletteName ][ Math.min( size,
            defaultSize ).toString() ];
        // return palette[index] || OTHERS_COLOR;
        return palette[ index ]
    }
    _getSymbolizer( config, index, size, defaultSize ) {
        const { layerType } = config;
        const s = new OpenLayers.Symbolizer[ layerType ]( {
            strokeColor: this._getColor( 'stroke', config, index,
                size, defaultSize ),
            strokeWidth: config.strokeWidth,
            strokeOpacity: config.strokeOpacity
        } );
        if ( layerType != "Line" ) {
            s.fill = true;
            s.fillColor = this._getColor( 'fill', config, index, size,
                    defaultSize ),
                s.fillWidth = config.fillWidth,
                s.fillOpacity = config.fillOpacity
        }
        if ( layerType == "Point" ) {
            s.graphicName = config.graphicName;
            s.pointRadius = config.pointRadius;
        }
        return s;
    }
    _parseStyle( layerName, styleName, sld ) {
        const styleObj = this.format.read( sld );
        styleObj.name = styleName;
        return WMSClient.getLayerType( layerName ).then( layerType => {
            // var config = this._getDefaultConfig(layerName, layerType);
            // const {description} = styleObj.namedLayers[styleName].userStyles[0];
            // try {
            //   Object.assign(config, JSON.parse(description));
            // }
            // catch (err){}
            // styleObj.config = config;
            this._styles[ styleName ] = styleObj;
            return styleObj;
        } );
    }
    _getNewStyle( layerName, title ) {
        if ( this._newStyleNames[ layerName ] ) {
            return new Promise( ( resolve, reject ) => {
                resolve( this._newStyleNames[ layerName ] );
            } )
        }
        const styleName = layerName.split( ":" ).pop() + "_" + new Date().getTime();
        this._newStyleNames[ layerName ] = styleName;
        var styleObj = {
            version: "1.0.0",
            namedLayers: {},
            name: styleName
        };
        var newStyle = new OpenLayers.Style( null, {
            name: styleName,
            title: title,
            rules: []
        } );
        styleObj.namedLayers[ styleName ] = {
            name: layerName,
            userStyles: [ newStyle ]
        };
        return WMSClient.getLayerType( layerName ).then( layerType => {
            // styleObj.config = this._getDefaultConfig(layerName, layerType);
            this._styles[ styleName ] = styleObj;
            return styleName;
        } )
    }
    // _getDefaultConfig(layerName, layerType){
    //   return Object.assign({layerName, layerType}, DEFAULTS);
    // }
    saveStyle( styleObj, config, sld ) {
        if ( !sld ) {
            sld = this.format.write( styleObj )
        }
        const { layerName, styleName } = config
        const url = URLS.stylesUrl + "/save/" + layerName + "/" +
            styleName;
        return fetch( url, {
            method: "POST",
            // credentials: "include",
            credentials: "same-origin",
            body: sld,
            headers: new Headers( {
                "Content-Type": "application/xml; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            } )
        } );
    }
}
export default new StylesManager();
