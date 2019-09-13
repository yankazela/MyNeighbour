import React from 'react';
import { shallow } from 'enzyme';
import MyComponent from './Home';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({});

describe("MyComponent", () => {
  it("should render my component", () => {
    const component = shallow(
      <Provider store={store}>
        <MyComponent />
      </Provider>
    )
    expect(component).toMatchSnapshot()
  });
});