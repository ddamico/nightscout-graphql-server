class EntriesController < ApplicationController
  before_action :set_entry, only: [:show]

  # GET /entries
  # GET /entries.json
  def index
    @entries = Entry.limit(10)
  end

  # GET /entries/1
  # GET /entries/1.json
  def show
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_entry
      @entry = Entry.find(params[:id])
    end
end
