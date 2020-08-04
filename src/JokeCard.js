import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    marginBottom: 20,
  },
  cardContent: {
    padding: 5,
  },
  cardActions: {
    padding: 16,
  },
});

const Category = withStyles({
  root: {
    marginTop: 10,
    marginBottom: 10,
  },
})(Chip);

const JokeCard = ({ joke, likeJoke, unlikeJoke, index }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} id={`joke-${index}`}>
      <CardContent className={classes.cardContent}>
        {joke.categories.length > 0 ? (
          joke.categories.map((cat) => (
            <Category label={cat} key={cat} variant='outlined' />
          ))
        ) : (
          <Category label='regular' variant='outlined' />
        )}
        <Typography>{joke.joke}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          variant='contained'
          color='primary'
          onClick={() => likeJoke(joke.id)}
        >
          Like
        </Button>
        <Button
          variant='contained'
          color='default'
          onClick={() => unlikeJoke(joke.id)}
        >
          Unlike
        </Button>
      </CardActions>
    </Card>
  );
};

export default JokeCard;
