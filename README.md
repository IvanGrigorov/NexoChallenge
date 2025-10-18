# Nexo Coding Challenge

This is a brief documentation of how my implementation of the NEXO coding challenge works:



## Tech stack

 - [NodeJS v24.2.0](https://nodejs.org/download/release/v24.2.0/)
 - [Infura IO](https://www.infura.io/)
 - [Etherscan](https://etherscan.io/)
 - [SupaBase](https://supabase.com/)
 - [Express](https://expressjs.com/)
 - [Pino](https://github.com/pinojs/pino)



## Features

- Monitoring transactions on a Ether Contract
- Extend and add filter Configs
- Store transactions passing Config filters
- Check and autoload new Config on an interval
- Extensive logging
- Option to extend and use API Auth


## API Reference

#### Get all users

```http
  GET /users
```

#### POST new config

```http
  POST /config/apply
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `config`      | `JSON` | **Required**. Config with filters to be applied |



## Run Locally

Clone the project

```bash
  git clone https://github.com/IvanGrigorov/NexoChallenge.git
```

Go to the project directory

```bash
  cd NexoChallenge
```

Install dependencies

```bash
  npm install
```

Start REST API and Monitoring

```bash
  npm run start 
```

Start ONLY Monitoring

```bash
  npm run startMonitoring 
```

Start ONLY API

```bash
  npm run startAPI 
```


## Demo

For the demo only Config with filters `amountBigger` can be applied. That means that transactions ONLY WITH BIGGER AMOUNT THAT THE ONE SPECIFIED IN THE CONFIG will be stored.

```
{
  "amountBigger": 5.5e-8
}
```

## Database

```
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  config json NOT NULL,
  author uuid,
  active boolean DEFAULT false,
  CONSTRAINT configs_pkey PRIMARY KEY (id),
  CONSTRAINT configs_author_fkey FOREIGN KEY (author) REFERENCES public.users(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_hash text NOT NULL,
  config uuid NOT NULL,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_config_fkey FOREIGN KEY (config) REFERENCES public.configs(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  name text NOT NULL,
  admin boolean NOT NULL DEFAULT false,
  password_hash text NOT NULL UNIQUE,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
```



## Optimizations

- Expand to allow more and multiple filters
- Implement all CRUD operations for a Config
- Implement full authentication
- Allow dynamic change of the Contracts to monitor

