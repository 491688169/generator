import * as React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { specs, describe, it } from 'storybook-addon-specifications';
import { withInfo } from '@storybook/addon-info';

import { mount } from 'enzyme';
import * as expect from 'expect';

import { <%= componentName %> } from '../src/index';

addDecorator(withKnobs);
addDecorator(withInfo);

storiesOf('<%= componentName %>', module)
    .add('part1', () => {
        
    })

    .add('part2', () => {
        
    });
