class Entry
  include Mongoid::Document
  field :_id, type: String
  field :sgv, type: Integer
  field :date, type: String
  field :dateString, type: String
  field :trend, type: Integer
  field :direction, type: String
  field :device, type: String
  field :type, type: String
end
