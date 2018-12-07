'use strict';

import React from 'react';
import { Animated, Alert } from 'react-native'


const AnimationProxy = new Proxy(Animated, {
    get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver)
    },
})


export function animate (properties, callback = (() => {})) {

    if (Array.isArray(properties)) {

        AnimationProxy.parallel(properties.map((
            { 
                property, 
                toValue, 
                animation = 'spring', 
                duration = 500, 
                speed = 10,
                delay = 0
            }) => {
            return Animated[animation](            
                property,         
                {
                    toValue, 
                    speed,
                    duration,
                    delay,
                    useNativeDriver: true
                }    
            )
        })).start(callback)

    } else {
        console.error('Must pass animate() an array of objects { property, toValue }');
    }

}