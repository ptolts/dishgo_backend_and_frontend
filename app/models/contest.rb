#encoding: utf-8

class Contest
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "contest", database: "dishgo"
  field :access_token, type: String
  belongs_to :restaurant, class_name: "Restaurant", index: true


end