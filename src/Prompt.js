import React, { useEffect, useState } from 'react';
import './Prompt.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Prompt() {
  const [value, setValue] = useState('');
  const [prompts, setPrompts] = useState([/*{
    prompt: "Write a poem about a dog",
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  }*/]);
  const [responses, setResponses] = useState([]);

  /*const data = {
    prompt: "Write a poem about a dog",
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };*/

  const newPrompt = (e) => {
    e.preventDefault();

    /*setPrompts(prompts => {
       return prompts.map((prompt, index) => {
         if (index === 0) {
           return {
             ...prompt,
             prompt: value,
           }
         }
         return prompt;
       })
     });*/

    addPrompt({
      prompt: value,
    })

    callIT({
      prompt: value,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    setValue('');
  }

  const addPrompt = (prompt) => {
    if (!prompt.prompt || /^\s*$/.test(prompt.prompt)) {
      return;
    }

    setPrompts(prompts => [prompt, ...prompts]); //if we do item, spread operator (...<name of array>) then item is inserted at the front of the list
    //if we do the other way around (item, ...<name of array>) then item is inserted at the end of the list
  }

  /*const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
    },

    body: JSON.stringify(prompts[0]),
  };*/

  function callIT(prompt) {
    fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
      },

      body: JSON.stringify(prompt),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(data => {
        setResponses(responses => [data.choices[0].text, ...responses]);
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (prompts.length !== 0 && responses.length !== 0) {
      localStorage.setItem('prompts', JSON.stringify(prompts));
      localStorage.setItem('responses', JSON.stringify(responses));
    }
  }, [prompts, responses]);

  useEffect(() => {
    const tempJSON = localStorage.getItem('prompts');
    const tempJSON2 = localStorage.getItem('responses');

    if (tempJSON && tempJSON2) {
      setPrompts(JSON.parse(tempJSON));
      setResponses(JSON.parse(tempJSON2));
    }

  }, []);

  return (
    <div className="prompts">
      <p className="title">Fun with AI</p>
      <div>
        <TextField
          id='outlined-textarea'
          label="Prompt"
          multiline
          minRows={12}
          maxRows={100}
          value={value}
          style={{ width: 800 }}
          onChange={(e) => setValue(e.target.value)} />

        <div className="button">
          <Button
            onClick={newPrompt}
            color="primary"
            variant="contained"
            size="large"
            type="submit">
            Submit
          </Button>
        </div>
      </div>
      <p className="response_title">Responses</p>

      {/*prompts.length !== null ? (
        prompts.map((prompt, index) => (
          <div className="prompt_top" key={index}>
            <div className="prompt_title">
              <p>Prompt:</p>
              <p className="prompt_titleText">{prompt.prompt}</p>
            </div>
          </div>
        ))
      ) : (null)}

      {responses.length !== 0 ? (
        responses.map((response, index) => (
          <div className="prompt_bottom" key={index}>
            <div className="prompt_response">
              <p className="prompt_responseText">Response:</p>
              <p>{response}</p>
            </div>
          </div>
        ))
        ) : (null)*/}

      {responses.length !== 0 ? (
        (prompts).map((prompt, index) => {
          const response = responses[index];
          return (
            <div className="responses" key={index}>
              <div className="prompt_title">
                <p>Prompt:</p>
                <p className="prompt_titleText">{prompt.prompt}</p>
              </div>

              <div className="prompt_response">
                <p>Response:</p>
                <p className="prompt_responseText">{response}</p>
              </div>
            </div>
          )
        })
      ) : (null)}
    </div>
  )
}

export default Prompt