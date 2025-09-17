// store/reducers/usuarioReducer.js
const initialState = {
    usuarios: [],
};

const usuarioReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USUARIOS':
            return { ...state, usuarios: action.payload };
        default:
            return state;
    }
};

export default usuarioReducer;
