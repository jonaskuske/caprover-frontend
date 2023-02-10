import Utils from '../../utils/Utils'
import { ROOT_KEY_CHANGED, SIZE_CHANGED } from '../actions/GlobalActions'

const initalState = {
    isMobile: !window.matchMedia('(min-width: 768px)').matches,
    rootElementKey: Utils.generateUuidV4(),
}

export default function (
    state = initalState,
    action: { payload: any; type: string },
) {
    switch (action.type) {
        case ROOT_KEY_CHANGED:
            return { ...state, rootElementKey: Utils.generateUuidV4() }
        case SIZE_CHANGED:
            return { ...state, isMobile: action.payload }
        default:
            return state
    }
}
