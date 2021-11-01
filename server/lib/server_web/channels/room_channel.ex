defmodule ServerWeb.RoomChannel do
  use ServerWeb, :channel
  alias ServerWeb.Presence
  alias Server.BodyMovement

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def join("room:" <> numbers, payload, socket) do
    IO.inspect(socket)
    if authorized?(payload) do
      # send(self(), :after_join)
      {:ok, %{}, assign(socket, :room_id, numbers)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("myEvent", payload, %{:topic => "room:1"} = socket) do
    # broadcast_from! self "room:coach", "myEvent", payload
    user_id = Ecto.UUID.generate
    data = %{ "data" => payload }

    changeset = BodyMovement.changeset(%BodyMovement{}, %{user_id: user_id, data: data})
    Server.Repo.insert(changeset)
    ServerWeb.Endpoint.broadcast_from!(self(), "room:2", "myEvent", payload)

    # 5% of the time send a bad movement message back to the client
    if (1..5) |> Enum.member?(:rand.uniform(1000)) do
      random_body_part =
        payload
        |> Enum.filter(&(is_map(&1)))
        |> Enum.random

      # This sends to everyone on the channel
      # broadcast!(socket, "bad_movement_message", %{data: "Bad movement detected in #{random_body_part["part"]}"})

      # This sends only to the socket that sent in "bad_movement_message"
      push(socket, "bad_movement_message", %{data: "Bad movement detected in #{random_body_part["part"]}"})

      # This sends to a different channel entirely
      ServerWeb.Endpoint.broadcast_from!(
        self(),
        "room:2",
        "bad_movement_message",
        %{data: "Bad movement detected in #{random_body_part["part"]}"})
    end

    {:reply, :ok, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do

    # user = Repo.get(User, socket.assigns[:current_user_id])

    {:ok, _} = Presence.track(socket, "room:stuff", %{
      # user_id: user.id,
      # username: user.username
      room_id: socket.assigns[:room_id]
    })

    push socket, "presence_state", Presence.list(socket)

    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true # Totally not unsafe
  end
end
