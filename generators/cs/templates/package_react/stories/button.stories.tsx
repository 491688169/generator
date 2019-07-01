import * as React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { specs, describe, it } from 'storybook-addon-specifications';
import { withInfo } from '@storybook/addon-info';

import { mount } from 'enzyme';
import * as expect from 'expect';

import { Button } from '../src/index';

addDecorator(withKnobs);
addDecorator(withInfo);

storiesOf('Button', module)
    .add('with text', () => {
        const story = <Button text={text('prop1', 'initial state')}>Hello Button</Button>;

        specs(() =>
            describe('Button with text', () => {
                it('Should have the text Hello World', () => {
                    const output = mount(story);
                    expect(output.text()).toContain('Hello World');
                });
            })
        );

        return story;
    })

    .add('with some emoji', () => (
        <Button>
            <span role="img" aria-label="so cool">
                😀 😎 👍 💯
            </span>
        </Button>
    ));
