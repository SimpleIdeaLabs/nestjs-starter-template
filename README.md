<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">nestjs-template</h3>
  <p align="center">
    Simple NestJS boilerplate
    <br />
    <a href="https://github.com/SimpleIdeaLabs/nestjs-starter-template"><strong>Explore the docs »</strong></a>
    <br />
  </p>
</div>

<!-- GETTING STARTED -->
## Getting Started

an api boilerplate build with nestjs that comes with out of the box common features that are essential, like dockerized app, TDD e2e, logging, login, etc.

### Pre-requisites
1. NodeJS - v18.13.0
2. Docker

### Get Started

  1. Running the docker dev backend
    a. create .env file `cp .example.env .env`
    a. `yarn && yarn build`
    b. `docker-compose up`
  2. Running the e2e tests
    a. Change ENV inside `.env` to `TEST`
    b. `docker-compose -f docker-compose.e2e-test.yml up`

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Mark Ernest R. Matute- [linkedin](https://www.linkedin.com/in/mark-matute/) - markernest.matute@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
