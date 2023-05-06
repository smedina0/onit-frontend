import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Navbar, Nav } from 'react-bootstrap';
import { login, logout } from '../firebase';
import Date from '../components/Date';
import Feeling from '../components/Feeling';

function Index(props) {
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [categoryPlaceholder, setCategoryPlaceholder] =
    useState('+ New Category');

  const api_url = 'https://type.fit/api/quotes';

  async function getapi(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  }

  const [data, setData] = useState(null);

  const quoteapi = () => {
    if (selectedQuote) {
      return (
        <div>
          <div className='date'>
            <Date />
          </div>

          <br />
          <Link to={`/tasks/calendar`}>
            <div className='feeling'>
              <Feeling />
            </div>
          </Link>
          <br />
          <div className='quote'>
            <p className='quote-text'>{selectedQuote.text}</p>
            <p className='quote-text'>- {selectedQuote.author}</p>
          </div>
        </div>
      );
    }
  };

  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getapi(api_url);
      setData(result);
      const index = Math.floor(Math.random() * result.length);
      setSelectedQuote(result[index]);
    }
    fetchData();
  }, []);

  const handleChange = (event) => {
    if (event.target.name === 'category') {
      setCategory(event.target.value);
    } else {
      setTitle(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      'Submitting form with category:',
      category,
      'and title:',
      title
    );
    try {
      const token = await props.user.getIdToken();
      const response = await fetch('https://onit-app-api.herokuapp.com/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          category: category,
          title: title || 'Select ellipses to edit',
        }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
      setCategory('');
      setTitle('');
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryFocus = () => {
    setCategoryPlaceholder('Type to create a new category!');
  };

  const handleCategoryBlur = () => {
    setCategoryPlaceholder('+ Add a category');
  };

  const API_URL = 'https://onit-app-api.herokuapp.com/home';

  const getTasks = async () => {
    try {
      const token = await props.user.getIdToken();
      const response = await fetch(API_URL, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.user) {
      getTasks();
    }
  }, [props.user]);

  const loaded = () => {
    const categories = tasks.map((task) => task.category);
    const uniqueCategories = [...new Set(categories)];
    return (
      <>
        <ul class='index-list button-container'>
          {uniqueCategories.map((category) => (
            <li key={category} className='task'>
              <Link to={`/tasks/${category}`}>
                <Button className='index-buttons' variant='primary'>
                  {category}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
        <div>
          <form className='index-form' onSubmit={handleSubmit}>
            <label aria-label='Add New Category' htmlFor='category'></label>
            <input
              type='text'
              name='category'
              value={category}
              placeholder={categoryPlaceholder}
              onChange={handleChange}
              onFocus={handleCategoryFocus}
              onBlur={handleCategoryBlur}
            />
            {/* <input
              class='index-form-button'
              id='category'
              type='submit'
              value='+'
            /> */}
            <button type="submit" className="submit-category-button">
            Add
          </button>
          </form>
        </div>
      </>
    );
  };

  const loading = () => {
    return <h1>Loading...</h1>;
  };

  return (
    <>
      {!props.user ? (
        <>
          <h1>Welcome to Onit!</h1>
          <p>
            Onit is a task management app that helps you stay organized and
            productive. <br></br>
            <br></br>
            <span className='signUp'>Log in to get started!</span>
          </p>
          <br></br>
          <Nav.Link className='login-two' onClick={login}>
            Login
          </Nav.Link>
          <h2>Features</h2>
          <ul className='features-benefits'>
            <li>Task lists</li>
            <li>Reminders</li>
            <li>Categorization</li>
            <li>Progress tracking</li>
          </ul>
          <h2>Testimonials</h2>
          <blockquote>
            "I've been using Onit for a month now and it's completely
            transformed the way I manage my tasks. I highly recommend it!" -
            Jane Doe
          </blockquote>
          <blockquote>
            "Onit has been a game-changer for me. It's intuitive, easy to use,
            and has helped me stay on top of my workload." - John Smith
          </blockquote>
          <h2>Benefits</h2>
          <ul className='features-benefits'>
            <li>Increased productivity</li>
            <li>Improved organization</li>
            <li>Reduced stress</li>
          </ul>
          <h2>About</h2>
          <p>
            Onit was founded in 2023 with the mission of helping people stay
            organized and productive, while maintaining their mental health.{' '}
            <br></br>
            <br></br>Our team is dedicated to creating the best task management
            app on the market.
          </p>
        </>
      ) : (
        <section>
          <div>{quoteapi()}</div>

          <div>{tasks ? loaded() : loading()}</div>
        </section>
      )}
    </>
  );
}

export default Index;
