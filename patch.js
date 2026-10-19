
        
                const i32 = (v) => v
                const f32 = i32
                const f64 = i32
                
function toInt(v) {
                    return v
                }
function toFloat(v) {
                    return v
                }
function createFloatArray(length) {
                    return new Float64Array(length)
                }
function setFloatDataView(dataView, position, value) {
                    dataView.setFloat64(position, value)
                }
function getFloatDataView(dataView, position) {
                    return dataView.getFloat64(position)
                }
let IT_FRAME = 0
let FRAME = 0
let BLOCK_SIZE = 0
let SAMPLE_RATE = 0
let NULL_SIGNAL = 0
let INPUT = createFloatArray(0)
let OUTPUT = createFloatArray(0)
const G_sked_ID_NULL = -1
const G_sked__ID_COUNTER_INIT = 1
const G_sked__MODE_WAIT = 0
const G_sked__MODE_SUBSCRIBE = 1


function G_sked_create(isLoggingEvents) {
                return {
                    eventLog: new Set(),
                    events: new Map(),
                    requests: new Map(),
                    idCounter: G_sked__ID_COUNTER_INIT,
                    isLoggingEvents,
                }
            }
function G_sked_wait(skeduler, event, callback) {
                if (skeduler.isLoggingEvents === false) {
                    throw new Error("Please activate skeduler's isLoggingEvents")
                }

                if (skeduler.eventLog.has(event)) {
                    callback(event)
                    return G_sked_ID_NULL
                } else {
                    return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
                }
            }
function G_sked_waitFuture(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
            }
function G_sked_subscribe(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_SUBSCRIBE)
            }
function G_sked_emit(skeduler, event) {
                if (skeduler.isLoggingEvents === true) {
                    skeduler.eventLog.add(event)
                }
                if (skeduler.events.has(event)) {
                    const skedIds = skeduler.events.get(event)
                    const skedIdsStaying = []
                    for (let i = 0; i < skedIds.length; i++) {
                        if (skeduler.requests.has(skedIds[i])) {
                            const request = skeduler.requests.get(skedIds[i])
                            request.callback(event)
                            if (request.mode === G_sked__MODE_WAIT) {
                                skeduler.requests.delete(request.id)
                            } else {
                                skedIdsStaying.push(request.id)
                            }
                        }
                    }
                    skeduler.events.set(event, skedIdsStaying)
                }
            }
function G_sked_cancel(skeduler, id) {
                skeduler.requests.delete(id)
            }
function G_sked__createRequest(skeduler, event, callback, mode) {
                const id = G_sked__nextId(skeduler)
                const request = {
                    id, 
                    mode, 
                    callback,
                }
                skeduler.requests.set(id, request)
                if (!skeduler.events.has(event)) {
                    skeduler.events.set(event, [id])    
                } else {
                    skeduler.events.get(event).push(id)
                }
                return id
            }
function G_sked__nextId(skeduler) {
                return skeduler.idCounter++
            }
const G_commons__ARRAYS = new Map()
const G_commons__ARRAYS_SKEDULER = G_sked_create(false)
function G_commons_getArray(arrayName) {
            if (!G_commons__ARRAYS.has(arrayName)) {
                throw new Error('Unknown array ' + arrayName)
            }
            return G_commons__ARRAYS.get(arrayName)
        }
function G_commons_hasArray(arrayName) {
            return G_commons__ARRAYS.has(arrayName)
        }
function G_commons_setArray(arrayName, array) {
            G_commons__ARRAYS.set(arrayName, array)
            G_sked_emit(G_commons__ARRAYS_SKEDULER, arrayName)
        }
function G_commons_subscribeArrayChanges(arrayName, callback) {
            const id = G_sked_subscribe(G_commons__ARRAYS_SKEDULER, arrayName, callback)
            if (G_commons__ARRAYS.has(arrayName)) {
                callback(arrayName)
            }
            return id
        }
function G_commons_cancelArrayChangesSubscription(id) {
            G_sked_cancel(G_commons__ARRAYS_SKEDULER, id)
        }

const G_commons__FRAME_SKEDULER = G_sked_create(false)
function G_commons__emitFrame(frame) {
            G_sked_emit(G_commons__FRAME_SKEDULER, frame.toString())
        }
function G_commons_waitFrame(frame, callback) {
            return G_sked_waitFuture(G_commons__FRAME_SKEDULER, frame.toString(), callback)
        }
function G_commons_cancelWaitFrame(id) {
            G_sked_cancel(G_commons__FRAME_SKEDULER, id)
        }
const G_msg_FLOAT_TOKEN = "number"
const G_msg_STRING_TOKEN = "string"
function G_msg_create(template) {
                    const m = []
                    let i = 0
                    while (i < template.length) {
                        if (template[i] === G_msg_STRING_TOKEN) {
                            m.push('')
                            i += 2
                        } else if (template[i] === G_msg_FLOAT_TOKEN) {
                            m.push(0)
                            i += 1
                        }
                    }
                    return m
                }
function G_msg_getLength(message) {
                    return message.length
                }
function G_msg_getTokenType(message, tokenIndex) {
                    return typeof message[tokenIndex]
                }
function G_msg_isStringToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'string'
                }
function G_msg_isFloatToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'number'
                }
function G_msg_isMatching(message, tokenTypes) {
                    return (message.length === tokenTypes.length) 
                        && message.every((v, i) => G_msg_getTokenType(message, i) === tokenTypes[i])
                }
function G_msg_writeFloatToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_writeStringToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_readFloatToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_readStringToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_floats(values) {
                    return values
                }
function G_msg_strings(values) {
                    return values
                }
function G_msg_display(message) {
                    return '[' + message
                        .map(t => typeof t === 'string' ? '"' + t + '"' : t.toString())
                        .join(', ') + ']'
                }
function G_msg_VOID_MESSAGE_RECEIVER(m) {}
let G_msg_EMPTY_MESSAGE = G_msg_create([])
function G_bangUtils_isBang(message) {
            return (
                G_msg_isStringToken(message, 0) 
                && G_msg_readStringToken(message, 0) === 'bang'
            )
        }
function G_bangUtils_bang() {
            const message = G_msg_create([G_msg_STRING_TOKEN, 4])
            G_msg_writeStringToken(message, 0, 'bang')
            return message
        }
function G_bangUtils_emptyToBang(message) {
            if (G_msg_getLength(message) === 0) {
                return G_bangUtils_bang()
            } else {
                return message
            }
        }
const G_msgBuses__BUSES = new Map()
function G_msgBuses_publish(busName, message) {
            let i = 0
            const callbacks = G_msgBuses__BUSES.has(busName) ? G_msgBuses__BUSES.get(busName): []
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](message)
            }
        }
function G_msgBuses_subscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                G_msgBuses__BUSES.set(busName, [])
            }
            G_msgBuses__BUSES.get(busName).push(callback)
        }
function G_msgBuses_unsubscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                return
            }
            const callbacks = G_msgBuses__BUSES.get(busName)
            const found = callbacks.indexOf(callback)
            if (found !== -1) {
                callbacks.splice(found, 1)
            }
        }
const G_fs_OPERATION_SUCCESS = 0
const G_fs_OPERATION_FAILURE = 1
const G_fs__OPERATIONS_IDS = new Set()
const G_fs__OPERATIONS_CALLBACKS = new Map()
const G_fs__OPERATIONS_SOUND_CALLBACKS = new Map()
let G_fs__OPERATIONS_COUNTER = 1

function G_fs_soundInfoToMessage(soundInfo) {
                const info = G_msg_create([
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_STRING_TOKEN,
                    soundInfo.encodingFormat.length,
                    G_msg_STRING_TOKEN,
                    soundInfo.endianness.length,
                    G_msg_STRING_TOKEN,
                    soundInfo.extraOptions.length
                ])
                G_msg_writeFloatToken(info, 0, toFloat(soundInfo.channelCount))
                G_msg_writeFloatToken(info, 1, toFloat(soundInfo.sampleRate))
                G_msg_writeFloatToken(info, 2, toFloat(soundInfo.bitDepth))
                G_msg_writeStringToken(info, 3, soundInfo.encodingFormat)
                G_msg_writeStringToken(info, 4, soundInfo.endianness)
                G_msg_writeStringToken(info, 5, soundInfo.extraOptions)
                return info
            }
function G_fs__assertOperationExists(id, operationName) {
                if (!G_fs__OPERATIONS_IDS.has(id)) {
                    throw new Error(operationName + ' operation unknown : ' + id.toString())
                }
            }
function G_fs__createOperationId() {
                const id = G_fs__OPERATIONS_COUNTER++
                G_fs__OPERATIONS_IDS.add(id)
                return id
            }
function G_soundFileOpenOpts_parse(m, soundInfo) {
            const unhandled = new Set()
            let i = 0
            while (i < G_msg_getLength(m)) {
                if (G_msg_isStringToken(m, i)) {
                    const str = G_msg_readStringToken(m, i)
                    if (['-wave', '-aiff', '-caf', '-next', '-ascii'].includes(str)) {
                        soundInfo.encodingFormat = str.slice(1)

                    } else if (str === '-raw') {
                        console.log('-raw format not yet supported')
                        i += 4
                        
                    } else if (str === '-big') {
                        soundInfo.endianness = 'b'

                    } else if (str === '-little') {
                        soundInfo.endianness = 'l'

                    } else if (str === '-bytes') {
                        if (i < G_msg_getLength(m) && G_msg_isFloatToken(m, i + 1)) {
                            soundInfo.bitDepth = toInt(G_msg_readFloatToken(m, i + 1) * 8)
                            i++
                        } else {
                            console.log('failed to parse -bytes <value>')
                        }

                    } else if (str === '-rate') {
                        if (i < G_msg_getLength(m) && G_msg_isFloatToken(m, i + 1)) {
                            soundInfo.sampleRate = toInt(G_msg_readFloatToken(m, i + 1))
                            i++
                        } else {
                            console.log('failed to parse -rate <value>')
                        }

                    } else {
                        unhandled.add(i)
                    }
                    
                } else {
                    unhandled.add(i)
                }
                i++
            }
            return unhandled
        }
function G_readWriteFsOpts_parse(m, soundInfo, unhandledOptions) {
            // Remove the "open" token
            unhandledOptions.delete(0)

            let url = ""
            let urlFound = false
            let errored = false
            let i = 1
            while (i < G_msg_getLength(m)) {
                if (!unhandledOptions.has(i)) {

                } else if (G_msg_isStringToken(m, i)) {
                    url = G_msg_readStringToken(m, i)
                    urlFound = true

                } else {
                    console.log("[writesf/readsf~] invalid option index " + i.toString())
                    errored = true
                }
                i++
            }
            if (!urlFound) {
                console.log("[writesf/readsf~] invalid options, file url not found")
                return ''
            }
            if (errored) {
                return ''
            }
            return url
        }
function G_actionUtils_isAction(message, action) {
            return G_msg_isMatching(message, [G_msg_STRING_TOKEN])
                && G_msg_readStringToken(message, 0) === action
        }

function G_buf_clear(buffer) {
            buffer.data.fill(0)
        }
function G_buf_create(length) {
            return {
                data: createFloatArray(length),
                length: length,
                writeCursor: 0,
                pullAvailableLength: 0,
            }
        }
const G_fs_SOUND_STREAM_BUFFERS = new Map()
const G_fs__SOUND_BUFFER_LENGTH = 20 * 44100
function G_fs_closeSoundStream(id, status) {
            if (!G_fs__OPERATIONS_IDS.has(id)) {
                return
            }
            G_fs__OPERATIONS_IDS.delete(id)
            G_fs__OPERATIONS_CALLBACKS.get(id)(id, status)
            G_fs__OPERATIONS_CALLBACKS.delete(id)
            // Delete this last, to give the callback 
            // a chance to save a reference to the buffer
            // If write stream, there won't be a buffer
            if (G_fs_SOUND_STREAM_BUFFERS.has(id)) {
                G_fs_SOUND_STREAM_BUFFERS.delete(id)
            }
            G_fs_i_closeSoundStream(id, status)
        }
function G_fs_x_onCloseSoundStream(id, status) {
            G_fs_closeSoundStream(id, status)
        }
function G_buf_pushBlock(buffer, block) {
            if (buffer.pullAvailableLength + block.length > buffer.length) {
                throw new Error('buffer full')
            }

            let left = block.length
            while (left > 0) {
                const lengthToWrite = toInt(Math.min(
                    toFloat(buffer.length - buffer.writeCursor), 
                    toFloat(left),
                ))
                buffer.data.set(
                    block.subarray(
                        block.length - left, 
                        block.length - left + lengthToWrite
                    ), 
                    buffer.writeCursor
                )
                left -= lengthToWrite
                buffer.writeCursor = (buffer.writeCursor + lengthToWrite) % buffer.length
                buffer.pullAvailableLength += lengthToWrite
            }
            return buffer.pullAvailableLength
        }
function G_buf_pullSample(buffer) {
            if (buffer.pullAvailableLength <= 0) {
                return 0
            }
            const readCursor = buffer.writeCursor - buffer.pullAvailableLength
            buffer.pullAvailableLength -= 1
            return buffer.data[readCursor >= 0 ? readCursor : buffer.length + readCursor]
        }
function G_fs_openSoundReadStream(url, soundInfo, callback) {
            const id = G_fs__createOperationId()
            const buffers = []
            for (let channel = 0; channel < soundInfo.channelCount; channel++) {
                buffers.push(G_buf_create(G_fs__SOUND_BUFFER_LENGTH))
            }
            G_fs_SOUND_STREAM_BUFFERS.set(id, buffers)
            G_fs__OPERATIONS_CALLBACKS.set(id, callback)
            G_fs_i_openSoundReadStream(id, url, G_fs_soundInfoToMessage(soundInfo))
            return id
        }
function G_fs_x_onSoundStreamData(id, block) {
            G_fs__assertOperationExists(id, "G_fs_x_onSoundStreamData")
            const buffers = G_fs_SOUND_STREAM_BUFFERS.get(id)
            for (let i = 0; i < buffers.length; i++) {
                G_buf_pushBlock(buffers[i], block[i])
            }
            return buffers[0].pullAvailableLength
        }
function G_msgUtils_slice(message, start, end) {
            if (G_msg_getLength(message) <= start) {
                throw new Error('message empty')
            }
            const template = G_msgUtils__copyTemplate(message, start, end)
            const newMessage = G_msg_create(template)
            G_msgUtils_copy(message, newMessage, start, end, 0)
            return newMessage
        }
function G_msgUtils_concat(message1, message2) {
            const newMessage = G_msg_create(G_msgUtils__copyTemplate(message1, 0, G_msg_getLength(message1)).concat(G_msgUtils__copyTemplate(message2, 0, G_msg_getLength(message2))))
            G_msgUtils_copy(message1, newMessage, 0, G_msg_getLength(message1), 0)
            G_msgUtils_copy(message2, newMessage, 0, G_msg_getLength(message2), G_msg_getLength(message1))
            return newMessage
        }
function G_msgUtils_shift(message) {
            switch (G_msg_getLength(message)) {
                case 0:
                    throw new Error('message empty')
                case 1:
                    return G_msg_create([])
                default:
                    return G_msgUtils_slice(message, 1, G_msg_getLength(message))
            }
        }
function G_msgUtils_copy(src, dest, srcStart, srcEnd, destStart) {
            let i = srcStart
            let j = destStart
            for (i, j; i < srcEnd; i++, j++) {
                if (G_msg_getTokenType(src, i) === G_msg_STRING_TOKEN) {
                    G_msg_writeStringToken(dest, j, G_msg_readStringToken(src, i))
                } else {
                    G_msg_writeFloatToken(dest, j, G_msg_readFloatToken(src, i))
                }
            }
        }
function G_msgUtils__copyTemplate(src, start, end) {
            const template = []
            for (let i = start; i < end; i++) {
                const tokenType = G_msg_getTokenType(src, i)
                template.push(tokenType)
                if (tokenType === G_msg_STRING_TOKEN) {
                    template.push(G_msg_readStringToken(src, i).length)
                }
            }
            return template
        }
function computeUnitInSamples(sampleRate, amount, unit) {
        if (unit.slice(0, 3) === 'per') {
            if (amount !== 0) {
                amount = 1 / amount
            }
            unit = unit.slice(3)
        }

        if (unit === 'msec' || unit === 'milliseconds' || unit === 'millisecond') {
            return amount / 1000 * sampleRate
        } else if (unit === 'sec' || unit === 'seconds' || unit === 'second') {
            return amount * sampleRate
        } else if (unit === 'min' || unit === 'minutes' || unit === 'minute') {
            return amount * 60 * sampleRate
        } else if (unit === 'samp' || unit === 'samples' || unit === 'sample') {
            return amount
        } else {
            throw new Error("invalid time unit : " + unit)
        }
    }
const G_delayBuffers__BUFFERS = new Map()
const G_delayBuffers__SKEDULER = G_sked_create(true)
const G_delayBuffers_NULL_BUFFER = G_buf_create(1)
function G_delayBuffers_get(delayName) {
            G_delayBuffers__BUFFERS.get(delayName, buffer)
        }
function G_delayBuffers_set(delayName, buffer) {
            G_delayBuffers__BUFFERS.set(delayName, buffer)
            G_sked_emit(G_delayBuffers__SKEDULER, delayName)
        }
function G_delayBuffers_wait(delayName, callback) {
            G_sked_wait(G_delayBuffers__SKEDULER, delayName, callback)
        }
function G_delayBuffers_delete(delayName) {
            G_delayBuffers__BUFFERS.delete(delayName)
        }
function G_buf_writeSample(buffer, value) {
            buffer.data[buffer.writeCursor] = value
            buffer.writeCursor = (buffer.writeCursor + 1) % buffer.length
        }
function G_buf_readSample(buffer, offset) {
            // R = (buffer.writeCursor - 1 - offset) -> ideal read position
            // W = R % buffer.length -> wrap it so that its within buffer length bounds (but could be negative)
            // (W + buffer.length) % buffer.length -> if W negative, (W + buffer.length) shifts it back to positive.
            return buffer.data[(buffer.length + ((buffer.writeCursor - 1 - offset) % buffer.length)) % buffer.length]
        }
        
function NT_bang_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_bang_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_bang_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_bang_defaultMessageHandler(m) {}
function NT_bang_receiveMessage(state, m) {
                if (NT_bang_setSendReceiveFromMessage(state, m) === true) {
                    return
                }
                
                const outMessage = G_bangUtils_bang()
                state.messageSender(outMessage)
                if (state.sendBusName !== "empty") {
                    G_msgBuses_publish(state.sendBusName, outMessage)
                }
                return
            }



function NT_readsf_t_openStream(state, m, channelCount, onStreamClose) {
                if (state.streamOperationId !== -1) {
                    state.readingStatus = 3
                    G_fs_closeSoundStream(state.streamOperationId, G_fs_OPERATION_SUCCESS)
                }
        
                const soundInfo = {
                    channelCount,
                    sampleRate: toInt(SAMPLE_RATE),
                    bitDepth: 32,
                    encodingFormat: '',
                    endianness: '',
                    extraOptions: '',
                }
                const unhandledOptions = G_soundFileOpenOpts_parse(
                    m,
                    soundInfo,
                )
                const url = G_readWriteFsOpts_parse(
                    m,
                    soundInfo,
                    unhandledOptions
                )
                if (url.length === 0) {
                    return
                }
                state.streamOperationId = G_fs_openSoundReadStream(
                    url,
                    soundInfo,
                    onStreamClose,
                )
                state.buffers = G_fs_SOUND_STREAM_BUFFERS.get(state.streamOperationId)
            }



function NT_floatatom_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_floatatom_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_floatatom_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_floatatom_defaultMessageHandler(m) {}
function NT_floatatom_receiveMessage(state, m) {
                    if (G_bangUtils_isBang(m)) {
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
                    
                    } else if (
                        G_msg_getTokenType(m, 0) === G_msg_STRING_TOKEN
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        const setMessage = G_msgUtils_slice(m, 1, G_msg_getLength(m))
                        if (G_msg_isMatching(setMessage, [G_msg_FLOAT_TOKEN])) { 
                                state.value = setMessage    
                                return
                        }
        
                    } else if (NT_floatatom_setSendReceiveFromMessage(state, m) === true) {
                        return
                        
                    } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                    
                        state.value = m
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
        
                    }
                }





function NT_delwrite_t_setDelayName(state, delayName) {
                if (state.delayName.length) {
                    G_delayBuffers_delete(state.delayName)
                }
                state.delayName = delayName
                if (state.delayName.length) {
                    G_delayBuffers_set(state.delayName, state.buffer)
                }
            }

function NT_tgl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_tgl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_tgl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_tgl_defaultMessageHandler(m) {}
function NT_tgl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        state.valueFloat = state.valueFloat === 0 ? state.maxValue: 0
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_tgl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }

function NT_metro_setRate(state, rate) {
                state.rate = Math.max(rate, 0)
            }
function NT_metro_scheduleNextTick(state) {
                state.snd0(G_bangUtils_bang())
                state.realNextTick = state.realNextTick + state.rate * state.sampleRatio
                state.skedId = G_commons_waitFrame(
                    toInt(Math.round(state.realNextTick)), 
                    state.tickCallback,
                )
            }
function NT_metro_stop(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                state.realNextTick = 0
            }



function NT_add_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_add_setRight(state, value) {
                    state.rightOp = value
                }

function NT_mul_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_mul_setRight(state, value) {
                    state.rightOp = value
                }





function NT_delread_t_setDelayName(state, delayName, callback) {
                if (state.delayName.length) {
                    state.buffer = G_delayBuffers_NULL_BUFFER
                }
                state.delayName = delayName
                if (state.delayName.length) {
                    G_delayBuffers_wait(state.delayName, callback)
                }
            }
function NT_delread_t_setRawOffset(state, rawOffset) {
                state.rawOffset = rawOffset
                NT_delread_t_updateOffset(state)
            }
function NT_delread_t_updateOffset(state) {
                state.offset = toInt(Math.round(
                    Math.min(
                        Math.max(computeUnitInSamples(SAMPLE_RATE, state.rawOffset, "msec"), 0), 
                        toFloat(state.buffer.length - 1)
                    )
                ))
            }
function NT_delread_t_NOOP(_) {}









function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }

        const N_n_0_2_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_32_state = {
                                msgSpecs: [],
                            }
const N_n_0_0_state = {
                                buffers: [],
streamOperationId: -1,
readingStatus: 0,
                            }
const N_n_0_6_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_m_n_0_5_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_7_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_4_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_0_8_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_m_n_0_3_0_sig_state = {
                                currentValue: 500,
                            }
const N_n_0_11_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_m_n_0_9_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_20_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_m_n_0_19_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_23_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_m_n_0_22_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_27_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_tgl_defaultMessageHandler,
messageSender: NT_tgl_defaultMessageHandler,
                            }
const N_n_0_25_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_0_26_state = {
                                currentValue: 0,
                            }
const N_n_0_28_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_29_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_31_state = {
                                msgSpecs: [],
                            }
const N_n_0_33_state = {
                                msgSpecs: [],
                            }
const N_n_0_3_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_n_0_22_state = {
                                phase: 0,
step: 0,
                            }
        
function N_n_0_2_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_2_state, m)
            return
        
                            throw new Error('Node "n_0_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_32_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_32_state.msgSpecs.splice(0, N_n_0_32_state.msgSpecs.length - 1)
                    N_n_0_32_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_32_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_32_state.msgSpecs.length; i++) {
                        if (N_n_0_32_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_32_state.msgSpecs[i].send, N_n_0_32_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_32_snds_0(N_n_0_32_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_0_outs_0 = 0
let N_n_0_0_outs_1 = 0
function N_n_0_0_rcvs_0(m) {
                            
            if (G_msg_getLength(m) >= 2) {
                if (G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'open'
                ) {
                    NT_readsf_t_openStream(
                        N_n_0_0_state,
                        m,
                        1,
                        function () {
                            N_n_0_0_state.streamOperationId = -1
                            if (N_n_0_0_state.readingStatus === 1) {
                                N_n_0_0_state.readingStatus = 2
                            } else {
                                N_n_0_0_state.readingStatus = 3
                            }
                        }
                    )
                    return
                }
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                if (G_msg_readFloatToken(m, 0) === 0) {
                    N_n_0_0_state.readingStatus = 3
                    return
    
                } else {
                    if (N_n_0_0_state.streamOperationId !== -1) {
                        N_n_0_0_state.readingStatus = 1
                    } else {
                        console.log('[readsf~] start requested without prior open')
                    }
                    return
    
                }
                
            } else if (G_actionUtils_isAction(m, 'print')) {
                console.log('[readsf~] reading = ' + N_n_0_0_state.readingStatus.toString())
                return
            }
        
                            throw new Error('Node "n_0_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_32_0_rcvs_0(m) {
                            
                IO_snd_n_0_32_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_32_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_2_0_rcvs_0(m) {
                            
                IO_snd_n_0_2_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_2_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_6_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_6_state, m)
                return
            
                            throw new Error('Node "n_0_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_5_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_5_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_5_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_5_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_5_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_5_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_6_0_rcvs_0(m) {
                            
                IO_snd_n_0_6_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_6_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_7_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_7_state, m)
                return
            
                            throw new Error('Node "n_0_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_4_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            } else {
                N_n_0_4_rcvs_0_message(m)
                return
            }
        
                            throw new Error('Node "m_n_0_4_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_4_rcvs_0_message(m) {
                            
            if (G_actionUtils_isAction(m, 'clear')) {
                G_buf_clear(N_n_0_4_state.buffer)
                return
            }
        
                            throw new Error('Node "n_0_4", inlet "0_message", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_7_0_rcvs_0(m) {
                            
                IO_snd_n_0_7_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_7_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_8_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_8_state, m)
                return
            
                            throw new Error('Node "n_0_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_3_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_3_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_3_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_3_0_sig_outs_0 = 0
function N_m_n_0_3_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_3_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_3_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_8_0_rcvs_0(m) {
                            
                IO_snd_n_0_8_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_8_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_11_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_11_state, m)
                return
            
                            throw new Error('Node "n_0_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_9_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_9_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_9_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_9_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_9_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_9_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_11_0_rcvs_0(m) {
                            
                IO_snd_n_0_11_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_11_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_20_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_20_state, m)
                return
            
                            throw new Error('Node "n_0_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_19_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_19_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_19_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_19_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_19_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_19_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_20_0_rcvs_0(m) {
                            
                IO_snd_n_0_20_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_20_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_23_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_23_state, m)
                return
            
                            throw new Error('Node "n_0_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_22_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_22_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_22_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_22_0_sig_outs_0 = 0
function N_m_n_0_22_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_22_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_22_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_23_0_rcvs_0(m) {
                            
                IO_snd_n_0_23_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_23_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_27_rcvs_0(m) {
                            
                NT_tgl_receiveMessage(N_n_0_27_state, m)
                return
            
                            throw new Error('Node "n_0_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_25_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_0_25_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_0_25_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_0_25_state)
                    return
                }
            }
        
                            throw new Error('Node "n_0_25", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_26_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            } else {
                N_n_0_26_rcvs_0_message(m)
                return
            }
        
                            throw new Error('Node "m_n_0_26_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_26_outs_0 = 0
function N_n_0_26_rcvs_0_message(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_28_rcvs_0(G_msg_floats([N_n_0_26_state.currentValue]))
                return 
            }
        
                            throw new Error('Node "n_0_26", inlet "0_message", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_28_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_28_state, G_msg_readFloatToken(m, 0))
                        N_n_0_29_rcvs_0(G_msg_floats([N_n_0_28_state.leftOp + N_n_0_28_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_29_rcvs_0(G_msg_floats([N_n_0_28_state.leftOp + N_n_0_28_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_29_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_29_state, G_msg_readFloatToken(m, 0))
                        N_n_0_8_rcvs_0(G_msg_floats([N_n_0_29_state.leftOp * N_n_0_29_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_8_rcvs_0(G_msg_floats([N_n_0_29_state.leftOp * N_n_0_29_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_27_0_rcvs_0(m) {
                            
                IO_snd_n_0_27_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_27_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_31_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_31_state.msgSpecs.splice(0, N_n_0_31_state.msgSpecs.length - 1)
                    N_n_0_31_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_31_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_31_state.msgSpecs.length; i++) {
                        if (N_n_0_31_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_31_state.msgSpecs[i].send, N_n_0_31_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_31_snds_0(N_n_0_31_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_31", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_31_0_rcvs_0(m) {
                            
                IO_snd_n_0_31_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_31_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_33_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_33_state.msgSpecs.splice(0, N_n_0_33_state.msgSpecs.length - 1)
                    N_n_0_33_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_33_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_33_state.msgSpecs.length; i++) {
                        if (N_n_0_33_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_33_state.msgSpecs[i].send, N_n_0_33_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_33_snds_0(N_n_0_33_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_33_0_rcvs_0(m) {
                            
                IO_snd_n_0_33_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_33_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }






















let N_n_0_3_outs_0 = 0





let N_n_0_10_outs_0 = 0







let N_n_0_22_outs_0 = 0

function N_n_0_2_snds_0(m) {
                        N_n_0_32_rcvs_0(m)
N_n_ioSnd_n_0_2_0_rcvs_0(m)
                    }
function N_n_0_32_snds_0(m) {
                        N_n_0_0_rcvs_0(m)
N_n_ioSnd_n_0_32_0_rcvs_0(m)
                    }
function N_n_0_6_snds_0(m) {
                        N_m_n_0_5_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_6_0_rcvs_0(m)
                    }
function N_n_0_7_snds_0(m) {
                        N_m_n_0_4_0__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_7_0_rcvs_0(m)
                    }
function N_n_0_8_snds_0(m) {
                        N_m_n_0_3_0__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_8_0_rcvs_0(m)
                    }
function N_m_n_0_3_0__routemsg_snds_0(m) {
                        N_m_n_0_3_0_sig_rcvs_0(m)
COLD_0(m)
                    }
function N_n_0_11_snds_0(m) {
                        N_m_n_0_9_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_11_0_rcvs_0(m)
                    }
function N_n_0_20_snds_0(m) {
                        N_m_n_0_19_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_20_0_rcvs_0(m)
                    }
function N_n_0_23_snds_0(m) {
                        N_m_n_0_22_0__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_23_0_rcvs_0(m)
                    }
function N_m_n_0_22_0__routemsg_snds_0(m) {
                        N_m_n_0_22_0_sig_rcvs_0(m)
COLD_1(m)
                    }
function N_n_0_27_snds_0(m) {
                        N_n_0_25_rcvs_0(m)
N_n_ioSnd_n_0_27_0_rcvs_0(m)
                    }
function N_n_0_30_snds_0(m) {
                        N_n_0_31_rcvs_0(m)
N_n_0_33_rcvs_0(m)
                    }
function N_n_0_31_snds_0(m) {
                        N_n_0_27_rcvs_0(m)
N_n_ioSnd_n_0_31_0_rcvs_0(m)
                    }
function N_n_0_33_snds_0(m) {
                        N_n_0_23_rcvs_0(m)
N_n_ioSnd_n_0_33_0_rcvs_0(m)
                    }

        function COLD_0(m) {
                    N_m_n_0_3_0_sig_outs_0 = N_m_n_0_3_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_0_3_state, N_m_n_0_3_0_sig_outs_0)
                }
function COLD_1(m) {
                    N_m_n_0_22_0_sig_outs_0 = N_m_n_0_22_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_22_state, N_m_n_0_22_0_sig_outs_0)
                }
        function IO_rcv_n_0_2_0(m) {
                    N_n_0_2_rcvs_0(m)
                }
function IO_rcv_n_0_6_0(m) {
                    N_n_0_6_rcvs_0(m)
                }
function IO_rcv_n_0_7_0(m) {
                    N_n_0_7_rcvs_0(m)
                }
function IO_rcv_n_0_8_0(m) {
                    N_n_0_8_rcvs_0(m)
                }
function IO_rcv_n_0_11_0(m) {
                    N_n_0_11_rcvs_0(m)
                }
function IO_rcv_n_0_20_0(m) {
                    N_n_0_20_rcvs_0(m)
                }
function IO_rcv_n_0_23_0(m) {
                    N_n_0_23_rcvs_0(m)
                }
function IO_rcv_n_0_27_0(m) {
                    N_n_0_27_rcvs_0(m)
                }
function IO_rcv_n_0_31_0(m) {
                    N_n_0_31_rcvs_0(m)
                }
function IO_rcv_n_0_32_0(m) {
                    N_n_0_32_rcvs_0(m)
                }
function IO_rcv_n_0_33_0(m) {
                    N_n_0_33_rcvs_0(m)
                }
        const IO_snd_n_0_2_0 = (m) => {exports.io.messageSenders['n_0_2']['0'](m)}
const IO_snd_n_0_6_0 = (m) => {exports.io.messageSenders['n_0_6']['0'](m)}
const IO_snd_n_0_7_0 = (m) => {exports.io.messageSenders['n_0_7']['0'](m)}
const IO_snd_n_0_8_0 = (m) => {exports.io.messageSenders['n_0_8']['0'](m)}
const IO_snd_n_0_11_0 = (m) => {exports.io.messageSenders['n_0_11']['0'](m)}
const IO_snd_n_0_20_0 = (m) => {exports.io.messageSenders['n_0_20']['0'](m)}
const IO_snd_n_0_23_0 = (m) => {exports.io.messageSenders['n_0_23']['0'](m)}
const IO_snd_n_0_27_0 = (m) => {exports.io.messageSenders['n_0_27']['0'](m)}
const IO_snd_n_0_31_0 = (m) => {exports.io.messageSenders['n_0_31']['0'](m)}
const IO_snd_n_0_32_0 = (m) => {exports.io.messageSenders['n_0_32']['0'](m)}
const IO_snd_n_0_33_0 = (m) => {exports.io.messageSenders['n_0_33']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.2.1","customMetadata":{"pdNodes":{"0":{"2":{"id":"2","type":"bng","args":[0,"",""],"nodeClass":"control","layout":{"x":47,"y":625,"size":35,"hold":250,"interrupt":50,"label":"","labelX":0,"labelY":-10,"labelFont":"0","labelFontSize":12,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"6":{"id":"6","type":"floatatom","args":[0,1,"",""],"nodeClass":"control","layout":{"x":594,"y":497,"widthInChars":5,"labelPos":0,"label":""}},"7":{"id":"7","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":323,"y":732,"widthInChars":5,"labelPos":0,"label":""}},"8":{"id":"8","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":320,"y":615,"widthInChars":5,"labelPos":0,"label":""}},"11":{"id":"11","type":"floatatom","args":[0,1,"",""],"nodeClass":"control","layout":{"x":373,"y":206,"widthInChars":5,"labelPos":0,"label":""}},"12":{"id":"12","type":"text","args":["DELAY time (in milliseconds)"],"nodeClass":"text","layout":{"x":225,"y":602,"width":18}},"13":{"id":"13","type":"text","args":["optional: override maximum delay time (in milliseconds)"],"nodeClass":"text","layout":{"x":305,"y":683,"width":23}},"14":{"id":"14","type":"text","args":["TRIGGER input sample X[n]"],"nodeClass":"text","layout":{"x":28,"y":579,"width":15}},"15":{"id":"15","type":"text","args":["FEED FORWARD GAIN: press shift and slide to change gain between 0 and 1"],"nodeClass":"text","layout":{"x":581,"y":440,"width":26}},"16":{"id":"16","type":"text","args":["BLEND GAIN: press shift and slide number box to change gain between 0 and 1"],"nodeClass":"text","layout":{"x":337,"y":132,"width":28}},"17":{"id":"17","type":"text","args":["WET/DRY SUM"],"nodeClass":"text","layout":{"x":1186,"y":546,"width":7}},"18":{"id":"18","type":"text","args":["OUTPUT SAMPLE y[n]"],"nodeClass":"text","layout":{"x":1283,"y":567,"width":13}},"20":{"id":"20","type":"floatatom","args":[0,0.99,"",""],"nodeClass":"control","layout":{"x":614,"y":890,"widthInChars":5,"labelPos":0,"label":""}},"21":{"id":"21","type":"text","args":["FEEDBACK GAIN press shift and slide to change gain between 0 and 0.99. A gain of 1 would create an unbound feedback that can damage hearing and equipment."],"nodeClass":"text","layout":{"x":566,"y":829}},"23":{"id":"23","type":"floatatom","args":[0.01,0.1,"",""],"nodeClass":"control","layout":{"x":318,"y":437,"widthInChars":5,"labelPos":0,"label":""}},"24":{"id":"24","type":"text","args":["LFO FREQUENCY: Flanger operates below threshold of echo (below 50ms)"],"nodeClass":"text","layout":{"x":308,"y":384,"width":24}},"27":{"id":"27","type":"tgl","args":[1,0,0,"",""],"nodeClass":"control","layout":{"x":365,"y":517,"size":19,"label":"","labelX":0,"labelY":-10,"labelFont":"0","labelFontSize":12,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"31":{"id":"31","type":"msg","args":[1],"nodeClass":"control","layout":{"x":366,"y":494}},"32":{"id":"32","type":"msg","args":["open","pulse_arpeggio.wav",",",1],"nodeClass":"control","layout":{"x":49,"y":683}},"33":{"id":"33","type":"msg","args":[0.025],"nodeClass":"control","layout":{"x":367,"y":437}}}},"graph":{"n_0_2":{"id":"n_0_2","type":"bang","args":{"outputOnLoad":false,"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_2_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_32","portletId":"0"},{"nodeId":"n_ioSnd_n_0_2_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_6":{"id":"n_0_6","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_6_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_5_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_6_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_7":{"id":"n_0_7","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_7_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_4_0__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_7_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_8":{"id":"n_0_8","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_29","portletId":"0"},{"nodeId":"n_ioRcv_n_0_8_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_3_0__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_8_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_11":{"id":"n_0_11","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_11_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_9_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_11_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_20":{"id":"n_0_20","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_20_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_19_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_20_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_23":{"id":"n_0_23","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_33","portletId":"0"},{"nodeId":"n_ioRcv_n_0_23_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_22_0__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_23_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_27":{"id":"n_0_27","type":"tgl","args":{"minValue":0,"maxValue":1,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_31","portletId":"0"},{"nodeId":"n_ioRcv_n_0_27_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_25","portletId":"0"},{"nodeId":"n_ioSnd_n_0_27_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_31":{"id":"n_0_31","type":"msg","args":{"msgSpecs":[{"tokens":[1],"send":null}]},"sources":{"0":[{"nodeId":"n_0_30","portletId":"0"},{"nodeId":"n_ioRcv_n_0_31_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_27","portletId":"0"},{"nodeId":"n_ioSnd_n_0_31_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_32":{"id":"n_0_32","type":"msg","args":{"msgSpecs":[{"tokens":["open","pulse_arpeggio.wav"],"send":null},{"tokens":[1],"send":null}]},"sources":{"0":[{"nodeId":"n_0_2","portletId":"0"},{"nodeId":"n_ioRcv_n_0_32_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_0","portletId":"0"},{"nodeId":"n_ioSnd_n_0_32_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_33":{"id":"n_0_33","type":"msg","args":{"msgSpecs":[{"tokens":[0.025],"send":null}]},"sources":{"0":[{"nodeId":"n_0_30","portletId":"0"},{"nodeId":"n_ioRcv_n_0_33_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_ioSnd_n_0_33_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}}},"pdGui":[{"nodeClass":"control","patchId":"0","pdNodeId":"2","nodeId":"n_0_2"},{"nodeClass":"control","patchId":"0","pdNodeId":"6","nodeId":"n_0_6"},{"nodeClass":"control","patchId":"0","pdNodeId":"7","nodeId":"n_0_7"},{"nodeClass":"control","patchId":"0","pdNodeId":"8","nodeId":"n_0_8"},{"nodeClass":"control","patchId":"0","pdNodeId":"11","nodeId":"n_0_11"},{"nodeClass":"text","patchId":"0","pdNodeId":"12"},{"nodeClass":"text","patchId":"0","pdNodeId":"13"},{"nodeClass":"text","patchId":"0","pdNodeId":"14"},{"nodeClass":"text","patchId":"0","pdNodeId":"15"},{"nodeClass":"text","patchId":"0","pdNodeId":"16"},{"nodeClass":"text","patchId":"0","pdNodeId":"17"},{"nodeClass":"text","patchId":"0","pdNodeId":"18"},{"nodeClass":"control","patchId":"0","pdNodeId":"20","nodeId":"n_0_20"},{"nodeClass":"text","patchId":"0","pdNodeId":"21"},{"nodeClass":"control","patchId":"0","pdNodeId":"23","nodeId":"n_0_23"},{"nodeClass":"text","patchId":"0","pdNodeId":"24"},{"nodeClass":"control","patchId":"0","pdNodeId":"27","nodeId":"n_0_27"},{"nodeClass":"control","patchId":"0","pdNodeId":"31","nodeId":"n_0_31"},{"nodeClass":"control","patchId":"0","pdNodeId":"32","nodeId":"n_0_32"},{"nodeClass":"control","patchId":"0","pdNodeId":"33","nodeId":"n_0_33"}]},"settings":{"audio":{"channelCount":{"in":2,"out":2},"bitDepth":64,"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_2":["0"],"n_0_6":["0"],"n_0_7":["0"],"n_0_8":["0"],"n_0_11":["0"],"n_0_20":["0"],"n_0_23":["0"],"n_0_27":["0"],"n_0_31":["0"],"n_0_32":["0"],"n_0_33":["0"]},"messageSenders":{"n_0_2":["0"],"n_0_6":["0"],"n_0_7":["0"],"n_0_8":["0"],"n_0_11":["0"],"n_0_20":["0"],"n_0_23":["0"],"n_0_27":["0"],"n_0_31":["0"],"n_0_32":["0"],"n_0_33":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_2":{"0":"IO_rcv_n_0_2_0"},"n_0_6":{"0":"IO_rcv_n_0_6_0"},"n_0_7":{"0":"IO_rcv_n_0_7_0"},"n_0_8":{"0":"IO_rcv_n_0_8_0"},"n_0_11":{"0":"IO_rcv_n_0_11_0"},"n_0_20":{"0":"IO_rcv_n_0_20_0"},"n_0_23":{"0":"IO_rcv_n_0_23_0"},"n_0_27":{"0":"IO_rcv_n_0_27_0"},"n_0_31":{"0":"IO_rcv_n_0_31_0"},"n_0_32":{"0":"IO_rcv_n_0_32_0"},"n_0_33":{"0":"IO_rcv_n_0_33_0"}},"messageSenders":{"n_0_2":{"0":"IO_snd_n_0_2_0"},"n_0_6":{"0":"IO_snd_n_0_6_0"},"n_0_7":{"0":"IO_snd_n_0_7_0"},"n_0_8":{"0":"IO_snd_n_0_8_0"},"n_0_11":{"0":"IO_snd_n_0_11_0"},"n_0_20":{"0":"IO_snd_n_0_20_0"},"n_0_23":{"0":"IO_snd_n_0_23_0"},"n_0_27":{"0":"IO_snd_n_0_27_0"},"n_0_31":{"0":"IO_snd_n_0_31_0"},"n_0_32":{"0":"IO_snd_n_0_32_0"},"n_0_33":{"0":"IO_snd_n_0_33_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"},"fs":{"i_closeSoundStream":"G_fs_i_closeSoundStream","x_onCloseSoundStream":"G_fs_x_onCloseSoundStream","i_openSoundReadStream":"G_fs_i_openSoundReadStream","x_onSoundStreamData":"G_fs_x_onSoundStreamData"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                
        N_n_0_2_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_2_state, m)
        }
        N_n_0_2_state.messageSender = N_n_0_2_snds_0
        NT_bang_setReceiveBusName(N_n_0_2_state, "empty")

        
    

            N_n_0_32_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_32_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_32_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_32_state.msgSpecs[0].outTemplate = []

                N_n_0_32_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_32_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_0_32_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_32_state.msgSpecs[0].outTemplate.push(18)
            
N_n_0_32_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_32_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_0_32_state.msgSpecs[0].outMessage, 0, "open")
            

                G_msg_writeStringToken(N_n_0_32_state.msgSpecs[0].outMessage, 1, "pulse_arpeggio.wav")
            

        
        
        
    
N_n_0_32_state.msgSpecs[1].outTemplate = []

                N_n_0_32_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_32_state.msgSpecs[1].outMessage = G_msg_create(N_n_0_32_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_0_32_state.msgSpecs[1].outMessage, 0, 1)
            
        




            N_n_0_6_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_6_state, m)
            }
            N_n_0_6_state.messageSender = N_n_0_6_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_6_state, "empty")
        




            N_n_0_7_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_7_state, m)
            }
            N_n_0_7_state.messageSender = N_n_0_7_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_7_state, "empty")
        


        N_n_0_4_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                5000,
                "msec"
            )))
        )
        if ("delayname1".length) {
            NT_delwrite_t_setDelayName(N_n_0_4_state, "delayname1")
        }
    


            N_n_0_8_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_8_state, m)
            }
            N_n_0_8_state.messageSender = N_n_0_8_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_8_state, "empty")
        




            N_n_0_11_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_11_state, m)
            }
            N_n_0_11_state.messageSender = N_n_0_11_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_11_state, "empty")
        




            N_n_0_20_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_20_state, m)
            }
            N_n_0_20_state.messageSender = N_n_0_20_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_20_state, "empty")
        




            N_n_0_23_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_23_state, m)
            }
            N_n_0_23_state.messageSender = N_n_0_23_snds_0
            NT_floatatom_setReceiveBusName(N_n_0_23_state, "empty")
        




                N_n_0_27_state.messageSender = N_n_0_27_snds_0
                N_n_0_27_state.messageReceiver = function (m) {
                    NT_tgl_receiveMessage(N_n_0_27_state, m)
                }
                NT_tgl_setReceiveBusName(N_n_0_27_state, "empty")
    
                
            

            N_n_0_25_state.snd0 = N_m_n_0_26_0__routemsg_rcvs_0
            N_n_0_25_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_0_25_state, 5)
            N_n_0_25_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_0_25_state)
            }
        



            NT_add_setLeft(N_n_0_28_state, 0)
            NT_add_setRight(N_n_0_28_state, 1)
        

            NT_mul_setLeft(N_n_0_29_state, 0)
            NT_mul_setRight(N_n_0_29_state, 10)
        

G_commons_waitFrame(0, () => N_n_0_30_snds_0(G_bangUtils_bang()))

            N_n_0_31_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_31_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_31_state.msgSpecs[0].outTemplate = []

                N_n_0_31_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_31_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_31_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_31_state.msgSpecs[0].outMessage, 0, 1)
            
        


            N_n_0_33_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_33_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_33_state.msgSpecs[0].outTemplate = []

                N_n_0_33_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_33_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_33_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_33_state.msgSpecs[0].outMessage, 0, 0.025)
            
        













        N_n_0_3_state.setDelayNameCallback = function (_) {
            N_n_0_3_state.buffer = G_delayBuffers__BUFFERS.get(N_n_0_3_state.delayName)
            NT_delread_t_updateOffset(N_n_0_3_state)
        }

        if ("delayname1".length) {
            NT_delread_t_setDelayName(N_n_0_3_state, "delayname1", N_n_0_3_state.setDelayNameCallback)
        }
    







            NT_osc_t_setStep(N_n_0_22_state, 0)
        
                COLD_0(G_msg_EMPTY_MESSAGE)
COLD_1(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            N_n_0_3_outs_0 = G_buf_readSample(N_n_0_3_state.buffer, N_n_0_3_state.offset)

        switch(N_n_0_0_state.readingStatus) {
            case 1: 
                N_n_0_0_outs_0 = G_buf_pullSample(N_n_0_0_state.buffers[0])
                break
                
            case 2: 
                N_n_0_0_outs_0 = G_buf_pullSample(N_n_0_0_state.buffers[0])
                if (N_n_0_0_state.buffers[0].pullAvailableLength === 0) {
                    G_msg_VOID_MESSAGE_RECEIVER(G_bangUtils_bang())
                    N_n_0_0_state.readingStatus = 3
                }
                break
    
            case 3: 
                N_n_0_0_outs_0 = 0
                N_n_0_0_state.readingStatus = 0
                break
        }
    
N_n_0_10_outs_0 = (N_n_0_3_outs_0 * (N_m_n_0_5_1_sig_state.currentValue)) + (N_n_0_0_outs_0 * (N_m_n_0_9_1_sig_state.currentValue))
OUTPUT[0][IT_FRAME] = N_n_0_10_outs_0
OUTPUT[1][IT_FRAME] = N_n_0_10_outs_0
G_buf_writeSample(N_n_0_4_state.buffer, (N_n_0_0_outs_0 + (N_n_0_3_outs_0 * (N_m_n_0_19_1_sig_state.currentValue))))

                N_n_0_22_outs_0 = Math.cos(N_n_0_22_state.phase)
                N_n_0_22_state.phase += N_n_0_22_state.step
            

        N_n_0_26_state.currentValue = N_n_0_22_outs_0
    
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_2: {
                            "0": IO_rcv_n_0_2_0,
                        },
n_0_6: {
                            "0": IO_rcv_n_0_6_0,
                        },
n_0_7: {
                            "0": IO_rcv_n_0_7_0,
                        },
n_0_8: {
                            "0": IO_rcv_n_0_8_0,
                        },
n_0_11: {
                            "0": IO_rcv_n_0_11_0,
                        },
n_0_20: {
                            "0": IO_rcv_n_0_20_0,
                        },
n_0_23: {
                            "0": IO_rcv_n_0_23_0,
                        },
n_0_27: {
                            "0": IO_rcv_n_0_27_0,
                        },
n_0_31: {
                            "0": IO_rcv_n_0_31_0,
                        },
n_0_32: {
                            "0": IO_rcv_n_0_32_0,
                        },
n_0_33: {
                            "0": IO_rcv_n_0_33_0,
                        },
                },
                messageSenders: {
                    n_0_2: {
                            "0": () => undefined,
                        },
n_0_6: {
                            "0": () => undefined,
                        },
n_0_7: {
                            "0": () => undefined,
                        },
n_0_8: {
                            "0": () => undefined,
                        },
n_0_11: {
                            "0": () => undefined,
                        },
n_0_20: {
                            "0": () => undefined,
                        },
n_0_23: {
                            "0": () => undefined,
                        },
n_0_27: {
                            "0": () => undefined,
                        },
n_0_31: {
                            "0": () => undefined,
                        },
n_0_32: {
                            "0": () => undefined,
                        },
n_0_33: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
                exports.G_fs_i_closeSoundStream = () => { throw new Error('import for G_fs_i_closeSoundStream not provided') }
                const G_fs_i_closeSoundStream = (...args) => exports.G_fs_i_closeSoundStream(...args)
            

                exports.G_fs_i_openSoundReadStream = () => { throw new Error('import for G_fs_i_openSoundReadStream not provided') }
                const G_fs_i_openSoundReadStream = (...args) => exports.G_fs_i_openSoundReadStream(...args)
            
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
exports.G_fs_x_onCloseSoundStream = G_fs_x_onCloseSoundStream
exports.G_fs_x_onSoundStreamData = G_fs_x_onSoundStreamData
    