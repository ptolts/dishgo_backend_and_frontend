# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
if ENV['RAILS_ENV'].to_s.eql?('development')
	User.create(email:"mrtolton@gmail.com",password:"planting",is_admin:true,confirmed_at:DateTime.now)
	r = Restaurant.create(name:"Phils Place of Horror")
	User.create(email:"phil@dishgo.io",password:"planting",is_admin:false,confirmed_at:DateTime.now,owns_restaurants:r)
end