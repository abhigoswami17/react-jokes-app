import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Fab,
  Zoom,
  CssBaseline,
  Container,
  Typography,
  Button,
  Tab,
  Tabs,
  Badge,
  CircularProgress,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import JokeCard from './JokeCard';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *': {
      margin: 20,
      width: '25ch',
    },
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor'
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role='presentation' className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <CircularProgress />
    </div>
  );
}

const App = (props) => {
  const [jokes, setJokes] = useState([]);
  const [jokesToShow, setJokesToShow] = useState([]);
  const [likedJokes, setLikedJokes] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('Chuck');
  const [lastName, setLastName] = useState('Norris');

  const classes = useStyles();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.icndb.com/jokes?firstName=${firstName}&lastName=${lastName}`
      );
      const data = await response.json();
      console.log(data.value);
      setJokes(data.value);
      setJokesToShow(data.value.slice(0, 10));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.icndb.com/categories');
      const data = await response.json();
      console.log(data.value);
      setCategories(data.value);
      setFilterCategories(data.value);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchCategories();
  }, []);

  const likeJoke = (id) => {
    if (likedJokes.find((joke) => joke.id === id)) return;
    const likedJoke = jokesToShow.find((joke) => joke.id === id);
    setLikedJokes([likedJoke, ...likedJokes]);
    // localStorage.setItem('likedJokes', likedJokes);
  };

  const unlikeJoke = (id) => {
    const updatedJokes = likedJokes.filter((joke) => joke.id !== id);
    setLikedJokes(updatedJokes);
    // localStorage.setItem('lokedJokes', likedJokes);
  };

  const addMoreJokes = () => {
    setLoading(true);
    setTimeout(() => {
      setJokesToShow(jokes.slice(0, jokesToShow.length + 10));
      setLoading(false);
    }, 500);
  };

  const observeElement = (bottomJoke) => {
    if (!bottomJoke) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          addMoreJokes();
          observer.unobserve(bottomJoke);
        }
      },
      {
        threshold: 1,
      }
    );

    observer.observe(bottomJoke);
  };

  useEffect(() => {
    const bottomJokeEl = document.getElementById(
      `joke-${jokesToShow.length - 1}`
    );
    observeElement(bottomJokeEl);
  }, [jokesToShow]);

  const toggleCategory = (event) => {
    const category = event.target.name;

    if (filterCategories.includes(category)) {
      // If found then remove
      const filterCategoriesCopy = [...filterCategories];
      const categoryIndex = filterCategoriesCopy.indexOf(category);
      filterCategoriesCopy.splice(categoryIndex, 1);
      setFilterCategories(filterCategoriesCopy);
    } else {
      // Else add it
      setFilterCategories([...filterCategories, category]);
    }
  };

  const categoryMatch = (jokeCategories) => {
    for (let i = 0; i < jokeCategories.length; i++) {
      if (filterCategories.includes(jokeCategories[i])) return true;
    }
    return false;
  };

  const changeName = (e) => {
    e.preventDefault();
    if (firstName === '' || lastName === '') return;
    fetchData();
  };

  return (
    <div className='App'>
      <CssBaseline />
      <Container>
        <AppBar>
          <Toolbar>
            <Typography variant='h5'>Funny Jokes</Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.offset} />
        <Toolbar id='back-to-top-anchor' />
        <Tabs
          value={currentTab}
          onChange={(e, value) => setCurrentTab(value)}
          centered
        >
          <Tab label='Home' id='home-tab' aria-controls='home-panel' />
          <Tab
            label={
              <Badge
                color='secondary'
                badgeContent={likedJokes.length > 0 ? likedJokes.length : null}
              >
                Likes
              </Badge>
            }
            id='likes-tab'
            aria-controls='likes-panel'
          />
        </Tabs>
        <div role='tabpanel' hidden={currentTab !== 0}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <form onSubmit={changeName} noValidate className={classes.form}>
              <TextField
                id='firstName'
                label='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                id='lastName'
                label='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button>
            </form>
          </div>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  name={category}
                  color='primary'
                  checked={filterCategories.includes(category)}
                  onChange={toggleCategory}
                />
              }
              label={category}
            />
          ))}
          {jokesToShow &&
            jokesToShow.map((joke, index) => {
              return (
                <JokeCard
                  key={joke.id}
                  joke={joke}
                  likeJoke={likeJoke}
                  unlikeJoke={unlikeJoke}
                  index={index}
                />
              );
            })}
          {loading && <Spinner />}
        </div>
        <div role='tabpanel' hidden={currentTab !== 1}>
          {likedJokes &&
            likedJokes.map((joke) => (
              <JokeCard
                key={joke.id}
                joke={joke}
                likeJoke={likeJoke}
                unlikeJoke={unlikeJoke}
              />
            ))}
        </div>
      </Container>
      <ScrollTop {...props}>
        <Fab color='secondary' size='small' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
};

export default App;
