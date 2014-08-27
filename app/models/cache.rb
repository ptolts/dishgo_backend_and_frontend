#encoding: utf-8

class Cache
	include Mongoid::Document
	include Mongoid::Timestamps

	store_in collection: "cache", database: "dishgo"

	field :website, type: String
	field :menu, type: String
	field :network_menu, type: String
	field :api_menu, type: Hash, default: {}

	belongs_to :restaurant, index: true

	def self.rebuild_all
		Cache.all.each do |cache|
			restaurant = cache.restaurant
			if !restaurant
				cache.destroy
			else
				restaurant.cache_job
			end
		end
	end
end