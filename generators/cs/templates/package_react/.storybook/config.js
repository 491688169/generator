import { configure, addParameters } from '@storybook/react';
import '@storybook/addon-console';

import { configure as configure4enzyme } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

configure4enzyme({ adapter: new Adapter() });

addParameters({
    viewport: {
        defaultViewport: 'responsive',
    },
});
