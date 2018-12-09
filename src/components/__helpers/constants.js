'use strict';

import React from 'react';
import { Animated, Alert, Platform, Dimensions } from 'react-native'


const IS_IPHONE_X = (() => {
    let dimensions;
    if (Platform.OS !== 'ios') {
        return false;
    }
    if (Platform.isPad || Platform.isTVOS) {
        return false;
    }
    dimensions = Dimensions.get('window');
    if (dimensions.height === 812 || dimensions.width === 812) { // Checks for iPhone X in portrait or landscape
        return true;
    }
    if (dimensions.height === 896 || dimensions.width === 896) { 
        return true;
    }
    return false;
})()

export const TAB_HEIGHT = (() => {

    if (IS_IPHONE_X) {
        // Tab height is 84
        return 82 * -1
    } else if (Platform.OS === 'ios') {
        // Tab height is 50
        return 48 * -1
    } else {
        return 55 * -1
    }
    
})()


export const DIMENSIONS = (() => {
    return Dimensions.get('window')
})()