// store.js
export const initialState = {
    d_line_chart_values: null,
    d_line_chart_option: null,
    stacked_line_bar_data: null,
    stacked_line_bar_label: null,
    pie_chart_values: null,
    gross_margin_value: null,
    gross_volume: null,
    gross_profit_value: null,
    fuel_value: null,
    shop_sale: null,
    shop_margin: null,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_DATA':
            return { ...state, ...action.payload };
        case 'RESET_STATE':
            return initialState; // Reset to the initial state
        default:
            return state;
    }
};
