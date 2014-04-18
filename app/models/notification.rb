#encoding: UTF-8

class Notification
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "Notification", database: "dishgo"
  
  field :message, type: String
  field :read, type: Boolean
  field :type, type: String
  
  belongs_to :user, index: true
  
  default_scope ->{ desc(:created_at) }
  index({ _id:1 }, { unique: true, name:"id_index" })
end
