// import 'regenerator-runtime/runtime'
// import { configure } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'

// configure({ adapter: new Adapter() })

import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
export { shallow, mount, render };
export default Enzyme;