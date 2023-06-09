import React, { useEffect, useState, useRef } from 'react'
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform
} from 'react-native';
import Toast from 'react-native-root-toast';
import useSound from './functions/useSound';
import bomb from './assets/bomb.jpg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Overlay } from "react-native-elements";

const BOMB_CODE = '7355608';
const BOMB_TIME = 42000;

export default function App() {
    // SOUND HOOKS
    const [keyPressSound] = useSound(require("./assets/keypress.mp3"));
    const [bombAudio, stopBombAudio] = useSound(require("./assets/bomb_lifecycle.mp3"));
    const [bombDefused] = useSound(require("./assets/bomb_defusal.mp3"));
    const [incorrectCode] = useSound(require("./assets/error.mp3"));

    // STATE
    const [inputDisplay, setInputDisplay] = useState("*******")
    const [input, setInput] = useState("")
    const [bombArmed, setBombArmed] = useState(false)
    const [gameEnded, setGameEnded] = useState(false);
    const [disarmTime, setDisarmTime] = useState(6);
    const [disarmUI, setDisarmUI] = useState(false);

    // REFS
    const timeRef = useRef(null);
    const DetonationCountDownTime = useRef(null);
    const DisarmCountDownTime = useRef(null);

    function detonationCountdown(seconds, fn) {
        let counter = seconds;
        DetonationCountDownTime.current = setInterval(() => {
            fn(counter);
            counter--;
            if(counter < 0) clearInterval(DetonationCountDownTime.current);
        }, 1000)
    }

    function disarmCountdown(seconds, fn) {
        let counter = seconds;
        DisarmCountDownTime.current = setInterval(() => {
            fn(counter);
            counter--;
            if(counter < 0) {
                clearInterval(DisarmCountDownTime.current);
                setDisarmUI(false);
            }
        }, 1000)
    }

    // FUNCTIONS

    function showDisarmToast() {
        Toast.show("You're difusing the bomb!", {
            duration: 6000,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true
        })
    }

    function showStartToast() {
        Toast.show("You picked up the bomb.", {
            duration: 3000,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true
        })
    }

    function showArmedToast() {
        Toast.show("Bomb has been planted. 40 seconds to detonation.", {
            duration: 3000,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true
        })
    }

    function armBomb() {
        console.log("arm bomb functionality");
        setBombArmed(true);
        bombAudio();

        showArmedToast();

        detonationCountdown(40, (sec => setInputDisplay(sec)));

        timeRef.current = setTimeout(() => {
            console.log(bombArmed);
            setInput("");
            setInputDisplay("*******");
            stopBombAudio();
            setBombArmed(false);
            setGameEnded(true);
            setInputDisplay("Terrorists Win");
        }, BOMB_TIME);
    }

    function disarmBomb() {
        console.log("disarm bomb functionality");
        stopBombAudio();
        clearInput()
        setBombArmed(false);
        setGameEnded(true);
        setInputDisplay("CTs Win");
        bombDefused();

        console.log(DetonationCountDownTime.current)

        clearTimeout(DetonationCountDownTime.current)
        clearTimeout(timeRef.current);
        setDisarmTime(6);
    }

    function clearInput() {
        setInput("");
        setInputDisplay("*******")
    }

    function handleInput(value) {
        try {
            if (gameEnded) {
                setGameEnded(false);
            }

            if(bombArmed === false) {
                console.log("inputDisplay:", inputDisplay)
                let inputArray = inputDisplay.split("");
                inputArray.shift();
                inputArray.push(value);

                keyPressSound();
                setInputDisplay(inputArray.join(""));
            } else incorrectCode();
        } catch(e) {
            console.log(`error: ${e}`)
        }
    }

    function handleDefusePressIn() {
        showDisarmToast();
        console.log(disarmUI)

        //DisarmCountDownTime.current = setInterval(() => setDisarmTime((time) => time + 1), 1000);
        disarmCountdown(6, setDisarmTime);
        setDisarmUI(true);
    }

    function handleDefusePressOut() {
        setDisarmUI(false);
        setDisarmTime(6);
    }

    function checkCode() {
        if (input.length  == BOMB_CODE.length) {
            if (inputDisplay == BOMB_CODE) {
                setInput("");
                setInputDisplay("");
                armBomb();
            } else {
                incorrectCode();
                clearInput();
            }
            // setInput("");
            // setInputDisplay("");
        }
    }

// EFFECTS

    useEffect(() => {
        checkCode();

        if(typeof inputDisplay === "string" && ([...inputDisplay][0] == "T" || [...inputDisplay][0] == "e")) {
            clearInput()
        }
    }, [input]);

    useEffect(() => {
        showStartToast();
    }, []);

// COMPONENTS

    const Col = ({ children }) => {
        return (
            <View style={styles[`3col`]}>{children}</View>
        );
    };

    const Row = ({ children }) => (
        <View style={styles.row}>{children}</View>
    )

    const DialPadButton = ({char}) => {
        return <TouchableHighlight key={char} onPress={() => { setInput(input + char); handleInput(char); }} title={char}><Text style={styles.button} >{char}</Text></TouchableHighlight >
    }

// APP

    return (
        <View style={styles.container}>
            <ImageBackground source={bomb} resizeMode="cover" style={styles.background}>
                <Text style={styles.inputDisplay} textAlign={'center'}>{inputDisplay}</Text>

                <View style={styles.buttons}>
                    <Row>
                        <Col>
                            <DialPadButton char={1} />
                        </Col>
                        <Col>
                            <DialPadButton char={2} />
                        </Col>
                        <Col>
                            <DialPadButton char={3} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <DialPadButton char={4} />
                        </Col>
                        <Col>
                            <DialPadButton char={5} />
                        </Col>
                        <Col>
                            <DialPadButton char={6} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <DialPadButton char={7} />
                        </Col>
                        <Col>
                            <DialPadButton char={8} />
                        </Col>
                        <Col>
                            <DialPadButton char={9} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <TouchableHighlight style={styles.button} title="*"><Text style={styles.button}>*</Text></TouchableHighlight >
                        </Col>
                        <Col>
                            <DialPadButton char={0} />
                        </Col>
                        <Col>
                            <TouchableHighlight style={styles.button} title="#"><Text style={styles.button}>#</Text></TouchableHighlight >
                        </Col>
                    </Row>
                    <Overlay
                        isVisible={disarmUI}
                        onBackdropPress={(() => setDisarmUI(false))}
                        borderRadius={3}
                        overlayBackgroundColor="red"
                        overlayStyle={{ backgroundColor: "rgba(000, 000, 000, 0.7)", elevation: 0, shadowOpacity: 0, borderRadius: 10, borderWidth: 10, borderColor: "rgba(000, 000, 000, 0.8)" }}
                    >
                        <View style={{ flexDirection: "row", borderRadius: 3 }}>
                            <View>
                                <AnimatedCircularProgress
                                    size={100}
                                    width={10}
                                    fill={disarmTime >= 6 ? 0 : (6 - disarmTime) * 16.67}
                                    rotation={0}
                                    tintColor="#fff"
                                    backgroundColor="#3d5875"
                                    lineCap="round"
                                >
                                    {() => <Icon name="pliers" size={55} color="#fff" />}
                                </AnimatedCircularProgress>
                            </View>
                            <View>
                                <Text style={{ color: "#fff", fontSize: 20 }}>You are disarming the bomb.{"\n"}{disarmTime}</Text>
                            </View>
                        </View>
                    </Overlay>
                </View>
                {
                    bombArmed && <View>
                        <Icon.Button name="pliers" size={45} backgroundColor="transparent" style={{marginLeft: 150}} onPressIn={handleDefusePressIn} onPressOut={handleDefusePressOut} onLongPress={disarmBomb} delayLongPress={6000} />
                    </View>
                }
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    background: {
        width: 360,
        height: 640,
    },
    button: {
        backgroundColor: '#93877a',
        textAlign: 'center',
        fontSize: 23,
        width: 35,
        height: 31,
    },
    buttons: {
        marginLeft: 76,
        marginRight: 118,
    },
    row: {
        flexDirection: 'row',
    },
    "3col":  {
        marginHorizontal: 16,
        marginBottom: 23,
        flex: 3,
    },
    inputDisplay: {
        textAlign: 'center',
        marginLeft: 33,
        marginTop: 74,
        marginBottom: 209,
        fontFamily: 'monospace',
        fontSize: 23,
        letterSpacing: 3,
    },
    overlayContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    overlayProgressContainer: {
        marginRight: 10
    },
    overlayTextContainer: {
        flex: 1,
        alignItems: "flex-end"
    }
});
