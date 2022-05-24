import React, { useEffect, useRef, useState } from 'react';
import './Prompt.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { HiChevronDown } from 'react-icons/hi';
import { MenuItem, MenuList, Popper, ClickAwayListener, Grow, Paper } from '@mui/material';

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


  //this is for presets on prompts
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = (e) => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event, text) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    if (text !== undefined) {
      addPrompt({
        prompt: text,
      })

      callIT({
        prompt: text,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            variant="contained"
            endIcon={<HiChevronDown />}>
            Examples
          </Button>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                    backgroundColor: 'lightgray',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem onClick={ (event) => handleClose(event, event.target.innerText) }>Write a poem about a dog on skis</MenuItem>
                      <MenuItem onClick={ (event) => handleClose(event, event.target.innerText) }>write a review on a resturant</MenuItem>
                      <MenuItem onClick={ (event) => handleClose(event, event.target.innerText) }>How does a telescope work?</MenuItem>
                      <MenuItem onClick={ (event) => handleClose(event, event.target.innerText) }>what is summer?</MenuItem>
                      <MenuItem onClick={ (event) => handleClose(event, event.target.innerText) }>Tell me about the night sky.</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>

          <Button
            color="error"
            variant="contained"
            onClick={() => {localStorage.clear();}}
          >
            Delete All
          </Button>

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