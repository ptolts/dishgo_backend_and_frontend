#encoding: utf-8

class Cache
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "cache", database: "dishgo"

  field :website, type: String
  field :menu, type: String

  belongs_to :restaurant, index: true
end