import React, { Component } from 'react'
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';
import M from 'materialize-css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb} from '@fortawesome/free-solid-svg-icons';
import quizSong from '../../assets/audio/starwarsaudio1.mp3';
import Sound from 'react-sound';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

class Play extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            previousRandomNumbers: [],
            nextButtonDisabled: false,
            previousButtonDisabled: true,
            summaryButtonDisabled: true
        };
        this.interval = null;
    };

    componentDidMount () {
        this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
    }
    
    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {

        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer, 
                previousRandomNumbers: []
            } , () => {
                this.showOptions();
                this.handleDisabledButton();
            });
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
    }

    handleNextButtonClick = () => {
        if (this.state.questions !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            })
        }
    }

    handlePreviousButtonClick = () => {
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            })
        }
    }

    handleQuitButtonClick = () => {
        if (window.confirm("Are you sure you want to quit?")){
            
        }
    };

    correctAnswer = () => {
        M.toast({
            html: "Correct Answer!",
            classes: "toast-valid",
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    };

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: "Wrong Answer!",
            classes: "toast-invalid",
            displayLength: 1500
        });
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
            
        });
    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });
    }

    handleHints = () => {
        // console.log("hints click")
        if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
        // console.log(options);
            let indexOfAnswer;

            options.forEach((option, index) => {
                if(option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            while(true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    });
                    break;
                }
                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }
    }

    handleDisabledButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                previousButtonDisabled: true
            });
        } else {
            this.setState({
                previousButtonDisabled: false
            });
        }
        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
            this.setState({
                nextButtonDisabled: true
            });
        } else {
            this.setState({
                nextButtonDisabled: false
            });
        }

        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
            this.setState({
                summaryButtonDisabled: false
            });
        } else {
            this.setState({
                summarytButtonDisabled: true
            });
        }
    }
    
    endGame = () => {
        
        // alert('Quiz has ended');
        const { state } = this;
        const playerStats = {
            score: state.score,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            hintsUsed: 5 - state.hints
        };
        let score = ((this.state.score / this.state.numberOfQuestions) * 100);

        
        console.log(playerStats);
        if (window.confirm('Your score: ' + score + '%')) {
        }
    }

    render () {
        // console.log(questions);
        const { currentQuestion, currentQuestionIndex, numberOfQuestions, hints} = this.state;
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio id="quizSound" src={quizSong}></audio>
                </Fragment>

                <Sound
                    url={quizSong}
                    playStatus="PLAYING"
                    loop={true} 
                />
                
                <div id="questions">
                    <section>
                    <h3>“Pass on what you have learned.”</h3>
                        <div className='lifeline-container'>
                            <p>
                                <span className='lifeline'>
                                    <FontAwesomeIcon onClick={this.handleHints} icon={faLightbulb} />{hints}
                                </span>
                            </p>
                            <p>
                                <span className='numberOfQuestions'>{currentQuestionIndex + 1} of {numberOfQuestions}</span>
                            </p>
                        </div>
                        <h5>{currentQuestion.question}</h5>
                        <div className='optionsContainer'>
                            <p onClick={this.handleOptionClick} className='option'>{currentQuestion.optionA}</p>
                            <p onClick={this.handleOptionClick} className='option'>{currentQuestion.optionB}</p>
                        </div>
                        <div className='optionsContainer'>
                            <p onClick={this.handleOptionClick} className='option'>{currentQuestion.optionC}</p>
                            <p onClick={this.handleOptionClick} className='option'>{currentQuestion.optionD}</p>
                        </div>

                        <div className='buttonConatinerQuizPage'>
                            <button className={classNames("", {'disable': this.state.previousButtonDisabled})} id="previousButton" onClick={this.handlePreviousButtonClick}>Previous</button>
                            <button className={classNames("", {'disable': this.state.nextButtonDisabled})} id="nextButton" onClick={this.handleNextButtonClick}>Next</button>
                            <Link to="/"><button id="quitButton" onClick={this.handleQuitButtonClick}>Quit</button></Link>
                            <Link to="/"><button id="summaryButton" className={classNames("", {'disable': this.state.summaryButtonDisabled})} onClick={this.endGame}>Summary</button></Link>
                        </div>
                    </section>
                    
                </div>
            </Fragment>
        );
    }
}

export default Play;