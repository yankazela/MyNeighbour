import React from 'react';
import { shallow, mount, render } from './setUpTest'
import MyComponent from './Home';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({});

describe("MyComponent", () => {
  it("should render my component", async () => {
    const component = await shallow(
      <Provider store={store}>
        <MyComponent />
      </Provider>
    )
    expect(component).toMatchSnapshot()
  });
});