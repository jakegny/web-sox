defmodule Server.BodyMovement do
  use Ecto.Schema
  import Ecto.Changeset

  schema "body_movements" do
    field :data, :map
    field :user_id, Ecto.UUID

    timestamps()
  end

  @doc false
  def changeset(body_movement, attrs) do
    body_movement
    |> cast(attrs, [:user_id, :data])
    |> validate_required([:user_id, :data])
  end
end
