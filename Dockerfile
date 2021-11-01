FROM bitwalker/alpine-elixir-phoenix:latest

WORKDIR /app

COPY ./server ./

# COPY /mix.exs .
# COPY /mix.lock .

RUN mix deps.get
RUN mix phx.server
