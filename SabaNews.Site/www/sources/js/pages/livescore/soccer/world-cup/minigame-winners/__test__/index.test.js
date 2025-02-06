import ReactDOM from "react-dom";
import { configureStore } from '@reduxjs/toolkit';
import minigameSlice from '../minigameWinnersSlice';

jest.mock("react-dom", () => ({ render: jest.fn() }));

describe("Application root", () => {
  it("should render without crashing", () => {
    const store = configureStore({
        reducer: minigameSlice
    });
    const div = document.createElement("div");
    div.id = "minigame-standing";
    document.body.appendChild(div);
    require("../index.jsx");
    expect(ReactDOM.render).toHaveBeenCalled();
  });
});