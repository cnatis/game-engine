// Game engine index file
import core from 'core';
export * from 'core';
import util from 'engineUtil';
export * from 'engineUtil';
import controls from './controls';
export * from './controls';

export default {
    core: core,
    util: util,
    controls: controls
};